class ViewsController {
    constructor(){
        
    }

    login(req, res){
        try {
            res.render('login', {
                showNav: true
            })
        } catch (error) {
            console.log(error)
        }
    }

    resetPasword(req, res){
        try {            
            res.render('resetPassword')
        } catch (error) {
            console.log(error)
        }
    }

    changePassword(req, res){
        try {            
            res.render('change-password')
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = new ViewsController()