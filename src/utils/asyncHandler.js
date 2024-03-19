//higher order fn
//middleware 
//a wrapper fn which is used everywhere in the code
const asyncHandler = (fn) => async (req,res,next) => {
    try {
        await fn(req,res,next)
    } catch (error) {
        res.status(err.code || 500).json({
            success : false,
            message : err.message
        })
    }
}

export default asyncHandler