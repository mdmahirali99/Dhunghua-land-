import { layout } from './layout'
import { DEMO_SCHEDULE } from '../utils/demoData'

export function schedulePage(): string {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const today = new Date().getDay()
  // Convert JS day (0=Sun) to our schedule (0=Mon)
  const todayIdx = today === 0 ? 6 : today - 1

  const schedByDay: Record<string, any[]> = {}
  days.forEach(d => schedByDay[d] = [])
  DEMO_SCHEDULE.forEach((item: any) => {
    const d = item.day_of_week
    if (schedByDay[d]) schedByDay[d].push(item)
  })

  const tabsHtml = days.map((d, i) => `
    <button class="sched-tab${i === todayIdx ? ' active' : ''}" data-day="${d}">
      ${d.slice(0,3)}
      ${i === todayIdx ? '<span class="today-dot"></span>' : ''}
    </button>
  `).join('')

  const daysHtml = days.map((d, i) => {
    const items = schedByDay[d]
    return `
<div class="sched-day${i === todayIdx ? ' active' : ''}" id="day-${d}">
  ${items.length === 0 ? '<div class="sched-empty"><i class="fas fa-moon"></i> No releases this day</div>' :
    items.map((item: any) => `
    <a href="/anime/${item.slug}" class="sched-card">
      <img src="${item.cover_image || 'https://placehold.co/80x112/0f0f17/6c5ce7?text=?'}"
           alt="${item.title}" class="sched-poster"
           onerror="this.src='https://placehold.co/80x112/0f0f17/6c5ce7?text=?'">
      <div class="sched-info">
        <div class="sched-title">${item.title}</div>
        ${item.air_time ? `<div class="sched-time"><i class="fas fa-clock"></i> ${item.air_time}</div>` : ''}
        ${item.episode_number ? `<div class="sched-ep">Episode ${item.episode_number}</div>` : ''}
        <span class="badge badge-green">Ongoing</span>
      </div>
    </a>`).join('')}
</div>`
  }).join('')

  const content = `
<div class="schedule-page-wrap">
  <div class="page-title">
    <i class="fas fa-calendar-alt"></i> Weekly Schedule
    <span class="page-title-sub">New episodes every week</span>
  </div>
  <div class="sched-tabs-wrap">
    <div class="sched-tabs">${tabsHtml}</div>
  </div>
  <div class="sched-content">
    ${daysHtml}
  </div>
</div>
`
  return layout('Schedule - Donghualand', content)
}
