import joi from 'joi'

const taskSchema = joi.object({
    title: joi.string().min(3).required(),
    description: joi.string(),
    status: joi.string().valid('pending', 'in-progress', 'complete'),
    priority: joi.string().valid('low', 'high', 'medium')

})

const validationSchema=joi.alternatives().try(taskSchema,joi.array().items(taskSchema))


export const ValidateTask = (req, res, next) => {

    const response = validationSchema.validate(req.body);
    console.log("joi validation error", response);

    if (response.error) {

        return res.status(400).json({ error: response.error.details[0].message });
    }

    next()
}