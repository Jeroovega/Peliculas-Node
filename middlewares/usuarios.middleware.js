
const isAuthenticated = (req, res, next) => {

    if (req.isAuthenticated()) { // isAuthenticated es de passport
        return next()
    }

    res.redirect('/api/auth/signin') // Si no está en los registros de session saco al usuario
}

export default isAuthenticated

