export function getData (req, res){
    const userData = res.locals.user

    res.status(200).send(userData)
}