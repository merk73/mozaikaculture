import {createHash} from 'node:crypto';
// Stable IDs from record keys.
const uuid=key=>{
  const bytes=createHash('sha256').update(`mozaika-report:${key}`).digest().subarray(0,16);
  bytes[6]=(bytes[6]&15)|64;bytes[8]=(bytes[8]&63)|128;
  const h=bytes.toString('hex');
  return `${h.slice(0,8)}-${h.slice(8,12)}-${h.slice(12,16)}-${h.slice(16,20)}-${h.slice(20)}`;
};
export const reportRecords=data=>[
  ...['before','after'].map(phase=>({
    file:`survey-${phase}`,folder:'forms',sheet:'survey_responses',
    headers:['id','response_date','age','participant_group','named_peoples','named_peoples_count','is_aware','interested_in_events'],
    widths:[43,16,9,25,60,23,14,24],dateColumns:[1],booleanColumns:[6,7],
    rows:data.survey[phase].map(r=>[uuid(r.id),r.date,r.age,r.status,r.names,r.count,Boolean(r.aware),r.interest==='Да'])
  })),
  {
    file:'event-registrations',folder:'events-results',sheet:'event_registrations',
    headers:['id','event_id','event_name','event_date','registration_date','registration_channel','age','city'],
    widths:[43,18,65,16,21,28,9,18],dateColumns:[3,4],booleanColumns:[],
    rows:data.registrations.map(r=>[uuid(r.id),r.eventId,r.event,r.eventDate,r.registrationDate,r.channel,r.age,r.city])
  },
  {
    file:'media-report',folder:'media',sheet:'media_publications',
    headers:['id','publication_date','event_name','publication_format','channel_name','views'],
    widths:[43,21,65,28,32,12],dateColumns:[1],booleanColumns:[],
    rows:data.publications.map(p=>[uuid(p.id),p.date,p.event,p.type,p.channel,p.views])
  }
];
