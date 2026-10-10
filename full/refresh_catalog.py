"""Refresh only public exam-resource metadata. PDFs/audio are not downloaded."""
import concurrent.futures
import datetime
import json
import pathlib
import re
import subprocess
import time

ROOT = pathlib.Path(__file__).resolve().parent
CACHE = ROOT / '.catalog-cache'
CACHE.mkdir(exist_ok=True)
existing = json.loads((ROOT / 'catalog.json').read_text(encoding='utf-8'))
subjects = existing['subjects']
current_year = datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=8))).year
jobs = [(s['code'], year, season) for year in range(current_year, 2000, -1)
        for s in subjects for season in ('Mar', 'Jun', 'Nov')]

def read_query(job):
    subject, year, season = job
    dest = CACHE / f'{subject}-{year}-{season}.json'
    # Historical sessions use durable snapshots. The current year is refreshed.
    if dest.exists() and year < current_year:
        try:
            value = json.loads(dest.read_text(encoding='utf-8'))
            if isinstance(value.get('rows'), list) and value.get('total') == len(value['rows']):
                return job, value, None
        except (ValueError, OSError):
            pass
    for attempt in range(3):
        reply = subprocess.run(['curl', '--fail', '-L', '--max-time', '30', '-sS', '-d',
            f'subject={subject}&year={year}&season={season}',
            'https://cie.fraft.cn/obj/Common/Fetch/renum'], capture_output=True)
        try:
            value = json.loads(reply.stdout)
            if reply.returncode == 0 and isinstance(value.get('rows'),list) and value.get('total') == len(value['rows']):
                dest.write_text(json.dumps(value,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
                return job, value, None
        except (ValueError, OSError):
            pass
        time.sleep(2 + attempt*3)
    return job, None, 'unavailable or invalid response; prior records retained'

# Preserve existing records during a partial refresh instead of dropping them.
records = {file: {'file':file,'lessons':existing.get('lessons',{}).get(file,{})} for file in existing['files']}
errors = []
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:
    for number, (job, value, error) in enumerate(executor.map(read_query,jobs),1):
        if error:
            errors.append({'subject':job[0],'year':job[1],'season':job[2],'error':error})
        else:
            for record in value['rows']:
                if re.fullmatch(r'[A-Za-z0-9_.+\-]+',record.get('file','')):
                    records[record['file']] = record
        if number%100 == 0:
            print(f'{number}/{len(jobs)} queries; {len(records)} files; {len(errors)} errors',flush=True)

meta = {'source':'https://cie.fraft.cn/', 'capturedAt':datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=8))).date().isoformat(),
        'queriesCompleted':len(jobs)-len(errors),'queriesTotal':len(jobs),'catalogComplete':not errors,'pdfFilesSaved':0}
catalog = {'subjects':subjects,'files':sorted(records),
           'lessons':{file:row['lessons'] for file,row in records.items() if isinstance(row.get('lessons'),dict) and row['lessons']},'meta':meta}
content=json.dumps(catalog,ensure_ascii=False,separators=(',',':'))
(ROOT / 'catalog.json').write_text(content,encoding='utf-8')
(ROOT / 'data.js').write_text('window.HUB_DATA='+content+';\n',encoding='utf-8')
(ROOT / 'catalog-status.json').write_text(json.dumps(meta|{'fileCount':len(records),'subjects':len(subjects)},ensure_ascii=False,indent=2),encoding='utf-8')
(ROOT / 'collection-report.json').write_text(json.dumps(meta|{'errors':errors},ensure_ascii=False,indent=2),encoding='utf-8')
print(f'Finished: {len(records)} files. Complete: {not errors}. See collection-report.json.')
