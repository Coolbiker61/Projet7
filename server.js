const Reddit = require('reddit')
 
const reddit = new Reddit({
  username: 'TODO',
  password: 'TODO',
  appId: 'TODO',
  appSecret: 'TODO',
  userAgent: 'MyApp/1.0.0 (http://example.com)'
})
 
// Submit a link to the /r/BitMidi subreddit
const res = await reddit.post('/api/submit', {
  sr: 'WeAreTheMusicMakers',
  kind: 'link',
  resubmit: true,
  title: 'BitMidi – 100K+ Free MIDI files',
  url: 'https://bitmidi.com'
})
 
console.log(res)
// Prints:
// {
//   json: {
//     errors: [],
//     data: {
//       url: 'https://www.reddit.com/r/WeAreTheMusicMakers/comments/96ak55/',
//       drafts_count: 0,
//       id: '96ak55',
//       name: 't3_96ak55'
//     }
//   }
// }