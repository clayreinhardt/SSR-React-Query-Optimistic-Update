// // an endpoint for getting user info
// export default (req, res) => {
//   if (req.cookies['swr-test-token'] === 'swr') {
//     // authorized
//     res.json({
//       loggedIn: true,
//       name: 'Clay',
//       avatar: 'https://github.com/clayreinhardt.png',
//     })
//     return
//   }

//   res.json({
//     loggedIn: false,
//   })
// }
