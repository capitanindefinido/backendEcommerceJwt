function auth(req, res, next) {
    console.log(req.session)
    if (req.session?.user?.email !== 'federico@gmail.com' ) {
    // if (req.session?.user?.email !== 'federico@gmail.com' ||  !req.session?.admin) {
        return res.status(401).send('error de autorización')
    }
    return next()
}

module.exports = {auth}