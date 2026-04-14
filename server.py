#!/usr/bin/env python3
import http.server
import socketserver
import os
import json
import psycopg2
from psycopg2.extras import RealDictCursor, Json
from datetime import datetime

PORT = 5000
HOST = "0.0.0.0"

SCRAPER_API_KEY = os.environ.get("SCRAPER_API_KEY", "")
DATABASE_URL = os.environ.get("DATABASE_URL", "")

def get_db_connection():
    return psycopg2.connect(DATABASE_URL)

def init_database():
    """Initialize database tables if they don't exist."""
    if not DATABASE_URL:
        print("[DB] No DATABASE_URL configured, skipping database init")
        return False
    
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        cur.execute("""
            CREATE TABLE IF NOT EXISTS external_events (
                id SERIAL PRIMARY KEY,
                event_id VARCHAR(50) UNIQUE NOT NULL,
                title VARCHAR(500) NOT NULL,
                date DATE NOT NULL,
                display_date VARCHAR(100),
                time VARCHAR(100),
                timezone VARCHAR(20) DEFAULT 'CT',
                convert_timezone BOOLEAN DEFAULT FALSE,
                event_type VARCHAR(50) DEFAULT 'External',
                location TEXT,
                description TEXT,
                registration_url TEXT,
                registration_label VARCHAR(50) DEFAULT 'Register',
                source_url TEXT,
                source VARCHAR(100),
                host JSONB DEFAULT '[]',
                location_type VARCHAR(50),
                tags JSONB DEFAULT '[]',
                is_external BOOLEAN DEFAULT TRUE,
                end_date VARCHAR(100),
                image TEXT,
                performer VARCHAR(500),
                price VARCHAR(50),
                price_currency VARCHAR(10) DEFAULT 'USD',
                offer_valid_from VARCHAR(20),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        for col, definition in [
            ('end_date', 'VARCHAR(100)'),
            ('image', 'TEXT'),
            ('performer', 'VARCHAR(500)'),
            ('price', 'VARCHAR(50)'),
            ('price_currency', "VARCHAR(10) DEFAULT 'USD'"),
            ('offer_valid_from', 'VARCHAR(20)'),
        ]:
            cur.execute(f"ALTER TABLE external_events ADD COLUMN IF NOT EXISTS {col} {definition}")
        
        cur.execute("""
            CREATE TABLE IF NOT EXISTS scraper_metadata (
                id SERIAL PRIMARY KEY,
                last_updated TIMESTAMP,
                sources JSONB DEFAULT '[]'
            )
        """)
        
        conn.commit()
        cur.close()
        conn.close()
        print("[DB] Database tables initialized successfully")
        return True
    except Exception as e:
        print(f"[DB] Error initializing database: {e}")
        return False

def save_events_to_db(events_data):
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        source = events_data.get('source')
        if source:
            cur.execute("DELETE FROM external_events WHERE source = %s", (source,))
        
        for event in events_data.get('events', []):
            if source and not event.get('source'):
                event['source'] = source
            cur.execute("""
                INSERT INTO external_events 
                (event_id, title, date, display_date, time, timezone, convert_timezone,
                 event_type, location, description, registration_url, registration_label,
                 source_url, source, host, location_type, tags, is_external,
                 end_date, image, performer, price, price_currency, offer_valid_from,
                 updated_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (event_id) DO UPDATE SET
                    title = EXCLUDED.title,
                    date = EXCLUDED.date,
                    display_date = EXCLUDED.display_date,
                    time = EXCLUDED.time,
                    timezone = EXCLUDED.timezone,
                    convert_timezone = EXCLUDED.convert_timezone,
                    event_type = EXCLUDED.event_type,
                    location = EXCLUDED.location,
                    description = EXCLUDED.description,
                    registration_url = EXCLUDED.registration_url,
                    registration_label = EXCLUDED.registration_label,
                    source_url = EXCLUDED.source_url,
                    source = EXCLUDED.source,
                    host = EXCLUDED.host,
                    location_type = EXCLUDED.location_type,
                    tags = EXCLUDED.tags,
                    is_external = EXCLUDED.is_external,
                    end_date = EXCLUDED.end_date,
                    image = EXCLUDED.image,
                    performer = EXCLUDED.performer,
                    price = EXCLUDED.price,
                    price_currency = EXCLUDED.price_currency,
                    offer_valid_from = EXCLUDED.offer_valid_from,
                    updated_at = EXCLUDED.updated_at
            """, (
                event.get('event_id'),
                event.get('title'),
                event.get('date'),
                event.get('displayDate'),
                event.get('time'),
                event.get('timezone', 'CT'),
                event.get('convertTimezone', False),
                event.get('type', 'External'),
                event.get('location'),
                event.get('description'),
                event.get('registrationUrl'),
                event.get('registrationLabel', 'Register'),
                event.get('sourceUrl'),
                event.get('source'),
                Json(event.get('host', []) if isinstance(event.get('host'), list) else [event.get('host')] if event.get('host') else []),
                event.get('locationType'),
                Json(event.get('tags', [])),
                event.get('isExternal', True),
                event.get('endDate'),
                event.get('image'),
                event.get('performer'),
                event.get('price'),
                event.get('priceCurrency', 'USD'),
                event.get('offerValidFrom'),
                datetime.now()
            ))
        
        cur.execute("DELETE FROM scraper_metadata")
        cur.execute("""
            INSERT INTO scraper_metadata (last_updated, sources)
            VALUES (%s, %s)
        """, (
            events_data.get('lastUpdated', datetime.now().isoformat()),
            Json(events_data.get('sources', []))
        ))
        
        conn.commit()
        return len(events_data.get('events', []))
    finally:
        cur.close()
        conn.close()

def get_events_from_db():
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        cur.execute("SELECT * FROM scraper_metadata ORDER BY id DESC LIMIT 1")
        metadata = cur.fetchone()
        
        cur.execute("""
            SELECT * FROM external_events 
            WHERE date >= CURRENT_DATE 
            ORDER BY date ASC
        """)
        events = cur.fetchall()
        
        formatted_events = []
        for event in events:
            formatted_events.append({
                "event_id": event['event_id'],
                "title": event['title'],
                "date": event['date'].isoformat() if event['date'] else None,
                "displayDate": event['display_date'],
                "time": event['time'],
                "timezone": event['timezone'],
                "convertTimezone": event['convert_timezone'],
                "type": event['event_type'],
                "location": event['location'],
                "description": event['description'],
                "registrationUrl": event['registration_url'],
                "registrationLabel": event['registration_label'],
                "sourceUrl": event['source_url'],
                "source": event['source'],
                "host": event['host'] if isinstance(event['host'], list) else json.loads(event['host']) if isinstance(event['host'], str) else [],
                "locationType": event['location_type'],
                "tags": event['tags'] if event['tags'] else [],
                "isExternal": event['is_external'],
                "endDate": event['end_date'],
                "image": event['image'],
                "performer": event['performer'],
                "price": event['price'],
                "priceCurrency": event['price_currency'],
                "offerValidFrom": event['offer_valid_from']
            })
        
        return {
            "lastUpdated": metadata['last_updated'].isoformat() if metadata and metadata['last_updated'] else None,
            "sources": metadata['sources'] if metadata and metadata['sources'] else [],
            "events": formatted_events
        }
    finally:
        cur.close()
        conn.close()

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        path = (getattr(self, 'path', '') or '').split('?')[0].lower()
        if any(path.endswith(ext) for ext in ('.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.ico', '.woff', '.woff2')):
            self.send_header('Cache-Control', 'public, max-age=604800')
        elif any(path.endswith(ext) for ext in ('.css', '.js')):
            self.send_header('Cache-Control', 'public, max-age=3600')
        else:
            self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
            self.send_header('Pragma', 'no-cache')
            self.send_header('Expires', '0')
        self.send_header('X-Frame-Options', 'SAMEORIGIN')
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('Referrer-Policy', 'strict-origin-when-cross-origin')
        self.send_header('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
        super().end_headers()

    def send_error(self, code, message=None, explain=None):
        if code == 404:
            try:
                with open('404.html', 'rb') as f:
                    body = f.read()
                self.send_response(404)
                self.send_header('Content-Type', 'text/html; charset=utf-8')
                self.send_header('Content-Length', str(len(body)))
                self.end_headers()
                self.wfile.write(body)
                return
            except OSError:
                pass
        super().send_error(code, message, explain)
    
    def do_GET(self):
        from urllib.parse import urlparse
        parsed_path = urlparse(self.path).path

        REDIRECTS_301 = {
            '/privacy':   '/privacy.html',
            '/terms':     '/terms.html',
            '/index.html': '/',
        }

        GONE_410 = {
            '/diagnostic',
            '/booking-calendar/monthly-ceo-coachvisory-session',
            '/service-page/growth-collective',
            '/pdfs/ASU-Larry-0201.pdf',
        }

        if parsed_path in REDIRECTS_301:
            self.send_response(301)
            self.send_header('Location', REDIRECTS_301[parsed_path])
            self.send_header('Content-Length', '0')
            self.end_headers()
            return

        if parsed_path in GONE_410 or parsed_path.startswith('/news.php'):
            body = b'410 Gone'
            self.send_response(410)
            self.send_header('Content-Type', 'text/plain')
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return

        if self.path == '/api/external-events':
            self.handle_get_external_events()
        elif parsed_path == '/sitemap.xml':
            self.handle_sitemap()
        elif self.serve_webp_if_supported(parsed_path):
            pass
        else:
            super().do_GET()

    def serve_webp_if_supported(self, parsed_path):
        if not any(parsed_path.lower().endswith(ext) for ext in ('.jpg', '.jpeg', '.png')):
            return False
        accept = self.headers.get('Accept', '')
        if 'image/webp' not in accept:
            return False
        webp_path = os.path.splitext(parsed_path)[0] + '.webp'
        file_path = webp_path.lstrip('/')
        if not os.path.isfile(file_path):
            return False
        try:
            with open(file_path, 'rb') as f:
                body = f.read()
            self.send_response(200)
            self.send_header('Content-Type', 'image/webp')
            self.send_header('Content-Length', str(len(body)))
            self.send_header('Vary', 'Accept')
            self.end_headers()
            self.wfile.write(body)
            return True
        except OSError:
            return False

    def handle_sitemap(self):
        import os
        from datetime import datetime, timezone

        PAGES = [
            ('https://www.motherlode.biz/',               'index.html',      'weekly',  '1.0'),
            ('https://www.motherlode.biz/about.html',     'about.html',      'monthly', '0.8'),
            ('https://www.motherlode.biz/events.html',    'events.html',     'daily',   '0.8'),
            ('https://www.motherlode.biz/media.html',     'media.html',      'monthly', '0.7'),
            ('https://www.motherlode.biz/diagnostic.html','diagnostic.html', 'monthly', '0.9'),
        ]

        def lastmod(filename):
            try:
                mtime = os.path.getmtime(filename)
                return datetime.fromtimestamp(mtime, tz=timezone.utc).strftime('%Y-%m-%d')
            except OSError:
                return datetime.now(tz=timezone.utc).strftime('%Y-%m-%d')

        urls = '\n'.join(
            f'  <url>\n'
            f'    <loc>{loc}</loc>\n'
            f'    <lastmod>{lastmod(filename)}</lastmod>\n'
            f'    <changefreq>{freq}</changefreq>\n'
            f'    <priority>{priority}</priority>\n'
            f'  </url>'
            for loc, filename, freq, priority in PAGES
        )

        body = (
            '<?xml version="1.0" encoding="UTF-8"?>\n'
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
            f'{urls}\n'
            '</urlset>\n'
        ).encode('utf-8')

        self.send_response(200)
        self.send_header('Content-Type', 'application/xml; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Cache-Control', 'public, max-age=3600')
        self.end_headers()
        self.wfile.write(body)
    
    def do_POST(self):
        if self.path == '/api/external-events':
            self.handle_external_events_upload()
        else:
            self.send_error(404, "Not Found")
    
    def do_DELETE(self):
        if self.path.startswith('/api/external-events'):
            self.handle_delete_external_events()
        else:
            self.send_error(404, "Not Found")
    
    def handle_delete_external_events(self):
        api_key = self.headers.get('X-API-Key', '')
        
        if not SCRAPER_API_KEY:
            self.send_json_response(500, {"error": "API key not configured on server"})
            return
        
        if api_key != SCRAPER_API_KEY:
            self.send_json_response(401, {"error": "Invalid API key"})
            return
        
        try:
            from urllib.parse import urlparse, parse_qs
            parsed = urlparse(self.path)
            params = parse_qs(parsed.query)
            source = params.get('source', [None])[0]
            
            if not source:
                self.send_json_response(400, {"error": "Missing 'source' query parameter"})
                return
            
            conn = get_db_connection()
            cur = conn.cursor()
            cur.execute("DELETE FROM external_events WHERE source = %s", (source,))
            deleted_count = cur.rowcount
            conn.commit()
            cur.close()
            conn.close()
            
            print(f"[API] Deleted {deleted_count} events for source: {source}")
            self.send_json_response(200, {
                "success": True,
                "message": f"Deleted {deleted_count} events for source '{source}'",
                "deletedCount": deleted_count
            })
            
        except Exception as e:
            print(f"[API] Error deleting events: {e}")
            self.send_json_response(500, {"error": f"Server error: {str(e)}"})
    
    def handle_get_external_events(self):
        try:
            events_data = get_events_from_db()
            self.send_json_response(200, events_data)
        except Exception as e:
            print(f"[API] Error fetching events: {e}")
            self.send_json_response(500, {"error": "Failed to fetch events"})
    
    def handle_external_events_upload(self):
        api_key = self.headers.get('X-API-Key', '')
        
        if not SCRAPER_API_KEY:
            self.send_json_response(500, {"error": "API key not configured on server"})
            return
        
        if api_key != SCRAPER_API_KEY:
            self.send_json_response(401, {"error": "Invalid API key"})
            return
        
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            if content_length == 0:
                self.send_json_response(400, {"error": "No data provided"})
                return
            
            if content_length > 1024 * 1024:
                self.send_json_response(413, {"error": "Payload too large (max 1MB)"})
                return
            
            post_data = self.rfile.read(content_length)
            events_data = json.loads(post_data.decode('utf-8'))
            
            if 'events' not in events_data:
                self.send_json_response(400, {"error": "Missing 'events' field in data"})
                return
            
            event_count = save_events_to_db(events_data)
            print(f"[API] Saved {event_count} external events to database")
            
            self.send_json_response(200, {
                "success": True,
                "message": f"Saved {event_count} events to database",
                "eventCount": event_count
            })
            
        except json.JSONDecodeError:
            self.send_json_response(400, {"error": "Invalid JSON data"})
        except Exception as e:
            print(f"[API] Error: {e}")
            self.send_json_response(500, {"error": f"Server error saving events: {str(e)}"})
    
    def send_json_response(self, status_code, data):
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode('utf-8'))

os.chdir(os.path.dirname(os.path.abspath(__file__)))

# Initialize database tables on startup
init_database()

socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer((HOST, PORT), MyHTTPRequestHandler) as httpd:
    print(f"Server running at http://{HOST}:{PORT}/")
    print(f"Serving files from: {os.getcwd()}")
    print(f"API endpoints:")
    print(f"  GET    /api/external-events - Fetch events from database")
    print(f"  POST   /api/external-events - Upload events to database")
    print(f"  DELETE /api/external-events?source=<source> - Delete events by source")
    httpd.serve_forever()
