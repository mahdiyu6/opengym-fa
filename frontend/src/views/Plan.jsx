import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore.js'
import { DAYN, uid, exCount } from '../lib/format.js'
import { t } from '../lib/i18n.js'
import { dayAssignSheet, loadStarterPlan, planToolsSheet } from '../sheets.jsx'
import Icon from '../components/Icon.jsx'
import { Button } from '../components/ui.jsx'
import { glyphOf, DEFAULT_GLYPH } from '../lib/glyphs.js'

export default function Plan() {
  const nav = useNavigate()
  const S = useStore(s => s.S)
  const update = useStore(s => s.update)

  const addRoutine = () => {
    const r = {
      id: uid(),
      name: t('New routine'),
      emoji: DEFAULT_GLYPH,
      ex: []
    }

    update(s => {
      s.routines.push(r)
    })

    nav('/plan/r/' + r.id)
  }

  return <>
    <div className="hdr">
      <div>
        <h1>{t('Plan')}</h1>
        <div className="sub">{t('Your weekly routine')}</div>
      </div>

      <button
        className="iconbtn"
        onClick={planToolsSheet}
        aria-label={t('Share your plan')}
        title={t('Share your plan')}
      >
        <Icon name="upload" />
      </button>
    </div>

    <div className="cols">
      <div>
        <h4 className="sec">{t('Week schedule')}</h4>

        <div
          className="list"
          style={{
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {[1, 2, 3, 4, 5, 6, 0].map(day => {
            const assignedIds = Array.isArray(S.week?.[day])
              ? S.week[day]
              : S.week?.[day]
                ? [S.week[day]]
                : []

            const assignedRoutines = assignedIds
              .map(id => S.routines.find(r => r.id === id))
              .filter(Boolean)

            return (
              <div
                key={day}
                className="item"
                onClick={() => dayAssignSheet(day)}
              >
                <div className="grow">
                  <div className="tt">{t(DAYN[day])}</div>

                  {assignedRoutines.length > 0 && (
                    <div
                      className="row"
                      style={{
                        gap: 6,
                        flexWrap: 'wrap',
                        marginTop: 6
                      }}
                    >
                      {assignedRoutines.map(routine => (
                        <span
                          key={routine.id}
                          className="tag acc"
                        >
                          <Icon name={glyphOf(routine.emoji)} />
                          {routine.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {assignedRoutines.length === 0 && (
                  <span className="tag">
                    {t('Rest')}
                  </span>
                )}

                <Icon
                  name="chevronRight"
                  className="chev"
                />
              </div>
            )
          })}
        </div>
      </div>

      <div>
        <div
          className="row between"
          style={{
            marginTop: 22,
            marginBottom: 10
          }}
        >
          <h4
            className="sec"
            style={{ margin: 0 }}
          >
            {t('Routines')}
          </h4>

          <Button
            size="sm"
            variant="tinted"
            icon="plus"
            onClick={addRoutine}
          >
            {t('New')}
          </Button>
        </div>

        {S.routines.length ? (
          <div className="list">
            {S.routines.map(routine => (
              <div
                key={routine.id}
                className="item"
                onClick={() => nav('/plan/r/' + routine.id)}
              >
                <span className="lrow-i">
                  <Icon name={glyphOf(routine.emoji)} />
                </span>

                <div className="grow">
                  <div className="tt">
                    {routine.name}
                  </div>

                  <div className="ss">
                    {exCount(routine.ex.length)}
                  </div>
                </div>

                <Icon
                  name="chevronRight"
                  className="chev"
                />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="empty">
              <div className="ico">
                <Icon name="clipboard" />
              </div>

              {t('No routines yet.')}
              <br />
              {t('Create one or load the starter plan.')}
            </div>

            <Button
              icon="sparkles"
              onClick={loadStarterPlan}
            >
              {t('Load starter plan (Push / Pull / Legs)')}
            </Button>
          </>
        )}
      </div>
    </div>
  </>
}
