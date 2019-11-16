const jwt = require('jsonwebtoken')

let verificaToken = (req, res, next) => {

    let token = req.get('token');


    jwt.verify(token, process.env.JWT_SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: "Token no válido"
                }
            })
        }

        req.usuario = decoded.usuario;

        next();

    })
};


let verificaAdminRole = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {

        res.json({
            ok: false,
            err: {
                message: 'El usuario no puede grabar nuevos usuarios'
            }
        })
    }

}



module.exports = {
    verificaToken,
    verificaAdminRole
}