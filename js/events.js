document.addEventListener('DOMContentLoaded', function() {
    const featuredContainer = document.getElementById('featured-container');
    const calendarDays = document.getElementById('calendar-days');
    const calendarDateRange = document.getElementById('calendar-date-range');
    const prevWeekBtn = document.getElementById('prev-week');
    const nextWeekBtn = document.getElementById('next-week');
    const todayBtn = document.getElementById('today-btn');
    const eventDetailsList = document.getElementById('event-details-list');
    const mobileEventList = document.getElementById('mobile-event-list');
    const noEventsMessage = document.getElementById('no-events-message');

    // Start from today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Current window start (always a Sunday for alignment)
    let windowStart = getWeekStart(today);
    
    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + 90);

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = String(str == null ? '' : str);
        return div.innerHTML;
    }

    function sanitizeUrl(url) {
        if (typeof url !== 'string') return '';
        try {
            const parsed = new URL(url, window.location.origin);
            if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
                return escapeHtml(parsed.href);
            }
        } catch (e) {}
        return '';
    }

    let allEvents = [];
    let filteredEvents = [];
    let hostFilter = 'all';
    let locationFilter = 'all';

    const hostFilterEl = document.getElementById('host-filter');
    const locationFilterEl = document.getElementById('location-filter');

    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    function getLocationType(location) {
        if (!location) return { type: 'unknown', label: 'Unknown' };
        const loc = location.toLowerCase();
        if (loc.includes('virtual') || loc.includes('alignable') || loc.includes('online') || loc.includes('zoom')) {
            return { type: 'virtual', label: 'Virtual' };
        }
        if (loc.includes('fulton market') || loc.includes('west loop') || loc.includes('lincoln park') || 
            loc.includes('logan square') || loc.includes('chicago, il') || loc.includes(', chicago')) {
            return { type: 'chicago', label: 'Chicago, IL' };
        }
        if (loc.includes(', il') || loc.includes('schaumburg') || loc.includes('hoffman estates') || 
            loc.includes('elgin') || loc.includes('palatine') || loc.includes('arlington heights')) {
            return { type: 'chicagoland', label: 'Chicagoland' };
        }
        return { type: 'other', label: 'In-Person' };
    }

    function normalizeHostArray(event, isExternal) {
        let hosts = event.host;
        if (!hosts || (Array.isArray(hosts) && hosts.length === 0)) {
            if (isExternal && event.source) {
                const sourceMap = {
                    'Always Be Connecting': 'always-be-connecting',
                    'alwaysbeconnecting': 'always-be-connecting',
                    'Windy City Business Network': 'windy-city-business-network',
                    'windycitybiz': 'windy-city-business-network',
                    'Alignable': 'alignable',
                    'alignable': 'alignable'
                };
                hosts = [sourceMap[event.source] || event.source.toLowerCase().replace(/\s+/g, '-')];
            } else {
                hosts = ['motherlode'];
            }
        } else if (!Array.isArray(hosts)) {
            hosts = [hosts];
        }
        return hosts;
    }

    function enrichEvent(event, isExternal = false) {
        const locationInfo = getLocationType(event.location);
        const hosts = normalizeHostArray(event, isExternal);
        return {
            ...event,
            isExternal: isExternal,
            host: hosts,
            locationType: locationInfo.type,
            locationLabel: locationInfo.label
        };
    }

    Promise.all([
        fetch('events-data.json').then(r => r.json()),
        fetch('/api/external-events').then(r => r.json()).catch(() => ({ events: [] }))
    ])
        .then(([motherlodeData, externalData]) => {
            if (motherlodeData.featured && featuredContainer) {
                renderFeatured(motherlodeData.featured);
            }
            const motherlodeEvents = (motherlodeData.events || []).map(e => enrichEvent(e, false));
            const externalEvents = (externalData.events || []).map(e => enrichEvent(e, true));
            allEvents = [...motherlodeEvents, ...externalEvents];
            applyFilters();
        })
        .catch(error => {
            console.error('Error loading events:', error);
            if (eventDetailsList) {
                eventDetailsList.innerHTML = '<p class="events-error">Unable to load events. Please try again later.</p>';
            }
        });

    if (prevWeekBtn) {
        prevWeekBtn.addEventListener('click', () => {
            windowStart.setDate(windowStart.getDate() - 7);
            renderTwoWeekCalendar();
            updateNavButtons();
        });
    }

    if (nextWeekBtn) {
        nextWeekBtn.addEventListener('click', () => {
            windowStart.setDate(windowStart.getDate() + 7);
            renderTwoWeekCalendar();
            updateNavButtons();
        });
    }

    if (todayBtn) {
        todayBtn.addEventListener('click', () => {
            windowStart = getWeekStart(new Date());
            renderTwoWeekCalendar();
            updateNavButtons();
        });
    }

    if (hostFilterEl) {
        hostFilterEl.addEventListener('change', (e) => {
            hostFilter = e.target.value;
            applyFilters();
        });
    }

    if (locationFilterEl) {
        locationFilterEl.addEventListener('change', (e) => {
            locationFilter = e.target.value;
            applyFilters();
        });
    }

    function applyFilters() {
        let events = filterEvents(allEvents);
        
        if (hostFilter !== 'all') {
            events = events.filter(e => {
                const hosts = Array.isArray(e.host) ? e.host : [e.host];
                return hosts.includes(hostFilter);
            });
        }
        
        if (locationFilter !== 'all') {
            events = events.filter(e => e.locationType === locationFilter);
        }
        
        filteredEvents = events;
        renderTwoWeekCalendar();
        renderEventDetails();
        renderMobileEventList();
        generateSchemaMarkup(filteredEvents);
        updateNavButtons();
    }

    function getWeekStart(date) {
        const d = new Date(date);
        const day = d.getDay();
        d.setDate(d.getDate() - day);
        d.setHours(0, 0, 0, 0);
        return d;
    }

    function filterEvents(events) {
        return events.filter(event => {
            const eventDate = new Date(event.date + 'T00:00:00');
            return eventDate >= today && eventDate <= maxDate;
        }).sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    function updateNavButtons() {
        const minWindowStart = getWeekStart(today);
        
        // Calculate max window start - align to week boundary
        // The last valid window should show events within the 90-day range
        const maxWindowStart = getWeekStart(maxDate);
        // Ensure we don't go past a window that would be entirely after maxDate
        maxWindowStart.setDate(maxWindowStart.getDate() - 7);

        if (prevWeekBtn) {
            prevWeekBtn.disabled = windowStart <= minWindowStart;
        }

        if (nextWeekBtn) {
            nextWeekBtn.disabled = windowStart >= maxWindowStart;
        }
        
        // Clamp windowStart to valid range (safety check)
        if (windowStart < minWindowStart) {
            windowStart = new Date(minWindowStart);
        }
        if (windowStart > maxWindowStart) {
            windowStart = new Date(maxWindowStart);
        }
    }

    function renderFeatured(featured) {
        const typeColors = {
            'Hosting': 'teal',
            'Speaking': 'purple',
            'Facilitating': 'hot-pink',
            'Office Hours': 'cerulean'
        };
        const colorClass = typeColors[featured.type] || 'cerulean';

        featuredContainer.textContent = '';

        const wrapper = document.createElement('div');
        wrapper.className = 'featured-event';

        const content = document.createElement('div');
        content.className = 'featured-event-content';

        const left = document.createElement('div');
        left.className = 'featured-left';

        const title = document.createElement('h3');
        title.className = 'featured-event-title';
        title.textContent = featured.title;

        const desc = document.createElement('p');
        desc.className = 'featured-event-description';
        desc.textContent = featured.description;

        left.appendChild(title);
        left.appendChild(desc);

        const right = document.createElement('div');
        right.className = 'featured-right';

        const link = document.createElement('a');
        const safeFeaturedHref = (function(url) {
            if (typeof url !== 'string') return '#';
            try {
                const p = new URL(url, window.location.origin);
                return (p.protocol === 'http:' || p.protocol === 'https:') ? p.href : '#';
            } catch (e) { return '#'; }
        })(featured.registrationUrl);
        link.href = safeFeaturedHref;
        link.target = '_blank';
        link.rel = 'noopener';
        link.className = 'btn btn-primary';
        link.textContent = featured.registrationLabel;

        const details = document.createElement('div');
        details.className = 'featured-event-details';

        const scheduleDetail = document.createElement('div');
        scheduleDetail.className = 'featured-detail';
        const calIcon = document.createElement('i');
        calIcon.className = 'fas fa-calendar-alt';
        const scheduleSpan = document.createElement('span');
        scheduleSpan.textContent = featured.schedule;
        scheduleDetail.appendChild(calIcon);
        scheduleDetail.appendChild(scheduleSpan);

        const locationDetail = document.createElement('div');
        locationDetail.className = 'featured-detail';
        const mapIcon = document.createElement('i');
        mapIcon.className = 'fas fa-map-marker-alt';
        const locationSpan = document.createElement('span');
        locationSpan.textContent = featured.location;
        locationDetail.appendChild(mapIcon);
        locationDetail.appendChild(locationSpan);

        details.appendChild(scheduleDetail);
        details.appendChild(locationDetail);

        right.appendChild(link);
        right.appendChild(details);

        content.appendChild(left);
        content.appendChild(right);
        wrapper.appendChild(content);
        featuredContainer.appendChild(wrapper);
    }

    function renderTwoWeekCalendar() {
        if (!calendarDays || !calendarDateRange) return;

        // Calculate date range for display
        const windowEnd = new Date(windowStart);
        windowEnd.setDate(windowEnd.getDate() + 13); // 14 days total (0-13)

        const options = { month: 'short', day: 'numeric' };
        const startStr = windowStart.toLocaleDateString('en-US', options);
        const endStr = windowEnd.toLocaleDateString('en-US', options);
        calendarDateRange.textContent = `${startStr} - ${endStr}`;

        let html = '';

        // Render 14 days (2 weeks)
        for (let i = 0; i < 14; i++) {
            const currentDate = new Date(windowStart);
            currentDate.setDate(windowStart.getDate() + i);
            
            const dateStr = formatDateStr(currentDate);
            const isPast = currentDate < today;
            const isToday = currentDate.toDateString() === today.toDateString();
            const isFriday = currentDate.getDay() === 5;

            const dayEvents = filteredEvents.filter(e => e.date === dateStr);

            let classes = 'calendar-day-compact';
            if (isPast) classes += ' past';
            if (isToday) classes += ' today';
            if (isFriday) classes += ' friday';

            // Day name (short)
            const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'short' });
            const dayNum = currentDate.getDate();

            let eventsHtml = '';
            if (dayEvents.length > 0) {
                eventsHtml = '<div class="day-events-compact">';
                dayEvents.forEach(event => {
                    const typeClass = getTypeClass(event.type, event.host, event.locationType);
                    eventsHtml += `
                        <div class="event-pill ${typeClass}" data-event-id="${escapeHtml(event.date)}-${typeClass}" onclick="scrollToEvent('${escapeHtml(event.date)}', '${typeClass}')" title="${escapeHtml(event.title)}">
                            <span class="event-pill-text">${escapeHtml(getShortName(event.title))}</span>
                        </div>
                    `;
                });
                eventsHtml += '</div>';
            }

            html += `
                <div class="${classes}">
                    <div class="day-header">
                        <span class="day-name">${dayName}</span>
                        <span class="day-num">${dayNum}</span>
                    </div>
                    ${eventsHtml}
                </div>
            `;
        }

        calendarDays.innerHTML = html;
    }

    function formatDateStr(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function getShortName(title) {
        const shortNames = {
            'Office Hours': 'Office Hours',
            'Loop\'d In': 'Loop\'d In SmartConnect (Alignable)',
            'Napkin Networking': 'Napkin Networking (In-person)'
        };
        return shortNames[title] || title;
    }

    function formatDisplayDate(dateStr) {
        if (!dateStr) return 'Date TBD';
        const date = new Date(dateStr + 'T00:00:00');
        return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    }

    function getHostBadgeLabel(hostSlug) {
        const labels = {
            'motherlode': 'Motherlode',
            'always-be-connecting': 'ABC',
            'windy-city-business-network': 'WCBN',
            'alignable': 'Alignable',
            'sagin': 'SAGIN'
        };
        return labels[hostSlug] || hostSlug;
    }

    function generateHostBadges(hosts) {
        if (!hosts || hosts.length === 0) return '';
        return hosts.map(h => {
            const label = getHostBadgeLabel(h);
            const badgeClass = h === 'motherlode' ? 'host-badge motherlode' : 'host-badge external';
            return `<span class="${badgeClass}">${escapeHtml(label)}</span>`;
        }).join('');
    }

    function renderEventDetails() {
        if (!eventDetailsList) return;

        if (filteredEvents.length === 0) {
            if (noEventsMessage) noEventsMessage.style.display = 'block';
            eventDetailsList.style.display = 'none';
            return;
        }

        if (noEventsMessage) noEventsMessage.style.display = 'none';
        eventDetailsList.style.display = 'flex';

        eventDetailsList.innerHTML = filteredEvents.map(event => {
            const hosts = Array.isArray(event.host) ? event.host : [event.host];
            const typeClass = getTypeClass(event.type, hosts, event.locationType);
            const displayTime = formatEventTime(event);
            const cardId = escapeHtml(`event-${event.date}-${typeClass}`);
            const hostBadge = generateHostBadges(hosts);
            const externalClass = event.isExternal ? ' external-event' : '';
            const locationTagClass = event.locationType === 'virtual' ? 'virtual' : 'in-person';
            const locationTagText = event.locationType === 'virtual' ? 'Virtual' : `In-Person: ${escapeHtml(event.locationLabel || 'TBD')}`;
            const locationTag = `<span class="location-tag ${locationTagClass}">${locationTagText}</span>`;
            
            const eventDisplayDate = event.displayDate || formatDisplayDate(event.date);
            const eventLocation = escapeHtml(event.location || 'Location TBD');
            const eventDescription = escapeHtml(event.description || '');

            return `
                <article id="${cardId}" class="event-detail-card ${typeClass}${externalClass}">
                    <div class="event-detail-content">
                        <div class="event-detail-info">
                            <h3>${escapeHtml(event.title)}${hostBadge}${locationTag}</h3>
                            <div class="event-detail-meta">
                                <span class="event-meta-item">
                                    <i class="fas fa-calendar-alt"></i>
                                    ${escapeHtml(eventDisplayDate)}
                                </span>
                                <span class="event-meta-item">
                                    <i class="fas fa-clock"></i>
                                    ${escapeHtml(displayTime)}
                                </span>
                                <span class="event-meta-item">
                                    <i class="fas fa-map-marker-alt"></i>
                                    ${eventLocation}
                                </span>
                            </div>
                            ${eventDescription ? `<p class="event-detail-description">${eventDescription}</p>` : ''}
                        </div>
                        <div class="event-detail-action">
                            ${event.isExternal && event.sourceUrl ? `
                                <a href="${sanitizeUrl(event.sourceUrl)}" target="_blank" rel="noopener" class="btn btn-secondary">View Event</a>
                                <a href="${sanitizeUrl(event.registrationUrl)}" target="_blank" rel="noopener" class="btn btn-primary">${escapeHtml(event.registrationLabel || 'Register')}</a>
                            ` : `
                                <a href="${sanitizeUrl(event.registrationUrl)}" target="_blank" rel="noopener" class="btn btn-primary">${escapeHtml(event.registrationLabel || 'Register')}</a>
                            `}
                        </div>
                    </div>
                </article>
            `;
        }).join('');
    }

    function renderMobileEventList() {
        if (!mobileEventList) return;

        if (filteredEvents.length === 0) {
            mobileEventList.innerHTML = '';
            return;
        }

        const eventsByWeek = {};
        filteredEvents.forEach(event => {
            const eventDate = new Date(event.date + 'T00:00:00');
            const weekStart = getWeekStart(eventDate);
            const weekKey = weekStart.toISOString().split('T')[0];

            if (!eventsByWeek[weekKey]) {
                eventsByWeek[weekKey] = {
                    startDate: weekStart,
                    events: []
                };
            }
            eventsByWeek[weekKey].events.push(event);
        });

        let html = '';
        Object.keys(eventsByWeek).sort().forEach(weekKey => {
            const week = eventsByWeek[weekKey];
            const weekEnd = new Date(week.startDate);
            weekEnd.setDate(weekEnd.getDate() + 6);

            const weekLabel = formatWeekLabel(week.startDate, weekEnd);
            html += `<div class="mobile-week-header">${escapeHtml(weekLabel)}</div>`;

            week.events.forEach(event => {
                const hosts = Array.isArray(event.host) ? event.host : [event.host];
                const typeClass = getTypeClass(event.type, hosts, event.locationType);
                const displayTime = formatEventTime(event);
                const mobileBadges = hosts.map(h => {
                    const label = getHostBadgeLabel(h);
                    const badgeClass = h === 'motherlode' ? 'mobile-host-badge motherlode' : 'mobile-host-badge external';
                    return `<span class="${badgeClass}">${escapeHtml(label)}</span>`;
                }).join('');

                const mobileDisplayDate = event.displayDate || formatDisplayDate(event.date);
                html += `
                    <div class="mobile-event-item" onclick="scrollToEvent('${escapeHtml(event.date)}', '${typeClass}')">
                        <div class="mobile-event-color ${typeClass}"></div>
                        <div class="mobile-event-info">
                            <div class="mobile-event-title">${escapeHtml(event.title)}${mobileBadges}</div>
                            <div class="mobile-event-datetime">${escapeHtml(mobileDisplayDate)} &bull; ${escapeHtml(displayTime)}</div>
                        </div>
                    </div>
                `;
            });
        });

        mobileEventList.innerHTML = html;
    }

    function formatWeekLabel(start, end) {
        const options = { month: 'short', day: 'numeric' };
        const startStr = start.toLocaleDateString('en-US', options);
        const endStr = end.toLocaleDateString('en-US', options);
        return `${startStr} - ${endStr}`;
    }

    function getTypeClass(type, hosts = [], locationType = null) {
        if (type === 'External' && Array.isArray(hosts) && hosts.includes('motherlode')) {
            return 'hosting';
        }
        if (type === 'Facilitating' && locationType === 'virtual') {
            return 'speaking';
        }
        const typeMap = {
            'Office Hours': 'office-hours',
            'Facilitating': 'facilitating',
            'Hosting': 'hosting',
            'Speaking': 'speaking',
            'External': 'external'
        };
        return typeMap[type] || 'facilitating';
    }

    function formatEventTime(event) {
        if (!event.convertTimezone) {
            return `${event.time} CT`;
        }

        try {
            const [startTime] = event.time.split(' - ');
            const timeParts = startTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);

            if (!timeParts) {
                return `${event.time} CT`;
            }

            let hours = parseInt(timeParts[1]);
            const minutes = timeParts[2];
            const period = timeParts[3]?.toUpperCase();

            if (period === 'PM' && hours !== 12) hours += 12;
            if (period === 'AM' && hours === 12) hours = 0;

            // Create a date object and determine the CT offset for that date (handles DST)
            const [year, month, day] = event.date.split('-').map(Number);
            
            // Create a temporary date to find Chicago's offset on this date
            const tempDate = new Date(Date.UTC(year, month - 1, day, hours, parseInt(minutes)));
            const chicagoTime = new Intl.DateTimeFormat('en-US', {
                timeZone: 'America/Chicago',
                year: 'numeric', month: '2-digit', day: '2-digit',
                hour: '2-digit', minute: '2-digit', hour12: false
            }).formatToParts(tempDate);
            
            // Get the offset by comparing UTC to Chicago time
            const chicagoOffset = tempDate.toLocaleString('en-US', { timeZone: 'America/Chicago', timeZoneName: 'shortOffset' }).match(/GMT([+-]\d+)/);
            const offsetHours = chicagoOffset ? parseInt(chicagoOffset[1]) : -6;
            
            // Create the actual event time in UTC by adding the CT offset
            const utcTime = new Date(Date.UTC(year, month - 1, day, hours - offsetHours, parseInt(minutes)));

            const formatter = new Intl.DateTimeFormat('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                timeZoneName: 'short',
                timeZone: userTimezone
            });

            const localTimeStr = formatter.format(utcTime);

            if (event.time.includes(' - ')) {
                const duration = event.time.includes('12:00 PM') ? 60 : 
                                event.time.includes('2:30 PM') ? 90 : 60;
                const endTime = new Date(utcTime.getTime() + (duration * 60 * 1000));
                const endFormatter = new Intl.DateTimeFormat('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    timeZone: userTimezone
                });
                const tzFormatter = new Intl.DateTimeFormat('en-US', {
                    timeZoneName: 'short',
                    timeZone: userTimezone
                });
                const tz = tzFormatter.format(utcTime).split(' ').pop();
                return `${localTimeStr.replace(/\s[A-Z]{2,4}$/, '')} - ${endFormatter.format(endTime)} ${tz}`;
            }

            return localTimeStr;
        } catch (e) {
            return `${event.time} CT`;
        }
    }

    function generateSchemaMarkup(events) {
        const schemaEvents = events.map(event => {
            const loc = event.location || '';
            const isVirtual = loc.toLowerCase().includes('virtual') || event.locationType === 'virtual';

            const schemaEvent = {
                "@type": "Event",
                "name": event.title,
                "description": event.description || event.title,
                "startDate": event.date,
                "eventAttendanceMode": isVirtual
                    ? "https://schema.org/OnlineEventAttendanceMode"
                    : "https://schema.org/OfflineEventAttendanceMode",
                "eventStatus": "https://schema.org/EventScheduled",
                "location": isVirtual ? {
                    "@type": "VirtualLocation",
                    "url": event.registrationUrl || ''
                } : {
                    "@type": "Place",
                    "name": loc || 'Location TBD',
                    "address": loc || 'Location TBD'
                },
                "organizer": {
                    "@type": "Organization",
                    "name": event.isExternal ? (event.source || 'External Organization') : "Motherlode Advising, LLC",
                    "url": "https://www.motherlode.biz"
                }
            };

            if (event.endDate) schemaEvent.endDate = event.endDate;
            if (event.image) schemaEvent.image = event.image;
            if (event.performer) {
                schemaEvent.performer = { "@type": "Person", "name": event.performer };
            }

            if (event.registrationUrl || event.price != null || event.priceCurrency || event.offerValidFrom) {
                const offer = { "@type": "Offer", "availability": "https://schema.org/InStock" };
                if (event.price != null && event.price !== '') offer.price = event.price;
                if (event.priceCurrency) offer.priceCurrency = event.priceCurrency;
                if (event.offerValidFrom) offer.validFrom = event.offerValidFrom;
                if (event.registrationUrl) offer.url = event.registrationUrl;
                schemaEvent.offers = offer;
            }

            return schemaEvent;
        });

        const existingSchema = document.querySelector('script[type="application/ld+json"]');
        if (existingSchema) {
            try {
                const schemaData = JSON.parse(existingSchema.textContent);
                if (schemaData['@graph']) {
                    schemaData['@graph'].push(...schemaEvents);
                    existingSchema.textContent = JSON.stringify(schemaData, null, 2);
                }
            } catch (e) {
                console.error('Error updating schema:', e);
            }
        }
    }

    window.scrollToEvent = function(date, typeClass) {
        const cardId = `event-${date}-${typeClass}`;
        const card = document.getElementById(cardId);
        const calendarSection = document.querySelector('.calendar-section');

        if (card && calendarSection) {
            const calendarHeight = calendarSection.offsetHeight;
            const headerHeight = 80;
            const cardTop = card.getBoundingClientRect().top + window.pageYOffset;
            const scrollTo = cardTop - headerHeight - calendarHeight - 20;

            window.scrollTo({ top: scrollTo, behavior: 'smooth' });

            setTimeout(() => {
                card.classList.add('highlight');
                setTimeout(() => {
                    card.classList.remove('highlight');
                }, 1500);
            }, 500);
        }
    };
});
