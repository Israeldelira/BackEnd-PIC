const Project = require('../models/project');

const getProjects = async (req, res) => {
    try {
        const pagination = Number(req.query.pagination) || 0;
        console.log(pagination);
        //Search all users in db
        const [allProjects, total] = await Promise.all([
            Project.find({ status: true })
                .skip(pagination)
                .limit(5)
                .populate('registerUser', 'user')
                .populate('outputs', 'article quantity description'),

            Project.countDocuments({ status: true })
        ])

        res.json({
            status: 200,
            ok: true,
            total,
            allProjects,
        })
    } catch (err) {
        res.status(500).send({ error: 'Ha ocurrido un problema con el servidor' });
        console.log(err);
    }
}
const projectDashboard = async (req, res) => {
    try {
        const [projectsComplete, projectsIncomplete,totalComplete,totalIncomplete] = await Promise.all([
            Project.find({ $and: [{ status: true }, { complete:true }] })
                .populate('registerUser', 'user')
                .populate('outputs', 'article quantity description'),

            Project.find({ $and: [{ status: true }, { complete:false }] })
                .populate('registerUser', 'user')
                .populate('outputs', 'article quantity description'),

            Project.countDocuments({ $and: [{ status: true }, { complete:true }] }),
            Project.countDocuments({ $and: [{ status: true }, { complete:false }] })
        ])

        res.json({
            status: 200,
            ok: true,
            projectsComplete,
            projectsIncomplete,
            totalComplete,
            totalIncomplete,
        })
    } catch (err) {
        res.status(500).send({ error: 'Ha ocurrido un problema con el servidor' });
        console.log(err);
    }
}
const getProjectsAll = async (req, res) => {
    try {
        const projects = await Project.find({ status: true })
        res.json({
            status: 200,
            ok: true,
            projects,
        })
    } catch (err) {
        res.status(500).send({ error: 'Ha ocurrido un problema con el servidor' });
        console.log(err);

    }
}
const getProject = async (req, res) => {
    const _id = req.params.id;
    try {
        const project = await Project.findById(_id)
            .populate('registerUser', 'user')
            .populate('outputs', 'article quantity description')
        res.json({
            status: 200,
            ok: true,
            project: project,
        })
    } catch (err) {
        res.status(500).send({ error: 'Ha ocurrido un problema con el servidor' });
        console.log(err);
    }
}
//<-------------POST  create new user with password encryption ---------------->
const createProject = async (req, res) => {
    const _id = req._id;
    const newProject = new Project({
        registerUser: _id,
        ...req.body
    });
    const name = newProject.name;
    try {

        // Validation of user with username
        const validationProject = await Project.findOne({ name });
        if (validationProject) {
            return res.status(400).json({
                ok: false,
                msg: `El proyecto: ${name} ya esta registrado`
            });
        }
        await newProject.save();
        res.status(200).json({
            ok: true,
            newProject,
            msg: `Proyecto: ${name} fue creado con exito`
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            ok: false,
            error: 'No se ha podido registrar el proyecto'
        });
    }
}
const deleteProject = async (req, res) => {
    const _id = req.params.id;

    try {
        const findProjectDB = await Project.findById(_id);
        if (!findProjectDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe el proyecto con ese id'
            });
        }
        //Delete user by id in db
        await Project.findOneAndUpdate({_id},{status:false},(err,project)=>{
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            return res.status(200).json({
                ok: true,
                project,
                msg: "Provedor eliminado con exito"
    
            });
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'No se ha podido eliminar al usuario'
        })
    }
}
const editProject = async (req, res) => {

    const _id = req.params.id;

    try {
        const findProjectDB = await Project.findById(_id);
        if (!findProjectDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe el proyecto con ese id'
            });
        }

        //Includes all values ​​except those before 3 points
        const {
            name,
            ...dataProject } = req.body;

        if (findProjectDB.name !== name) {

            const validationProject = await Project.findOne({ name });
            if (validationProject) {
                return res.status(400).json({
                    ok: false,
                    msg: 'El proyecto ya esta registrado'
                });
            }
        }

        //Update user
        dataProject.name = name;
        const projectUpdate = await Project.findByIdAndUpdate(_id, dataProject, { new: true });

        res.json({
            ok: true,
            user: projectUpdate
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'No se ha podido actualizar el proyecto '
        })
    }
}

const completeProject = async (req, res) => {

    const _id = req.params.id;

    try {
        const findProjectDB = await Project.findById(_id);
        if (!findProjectDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe el proyecto con ese id'
            });
        }

        //Includes all values ​​except those before 3 points
        const {
            complete,
            ...dataProject } = req.body;

        if (findProjectDB.complete === true) {

            const validationProject = await Project.findOne({ complete });
            if (validationProject) {
                return res.status(400).json({
                    ok: false,
                    msg: 'El proyecto ya esta finalizado'
                });
            }
        }

   
        dataProject.complete = true;
        const projectUpdate = await Project.findByIdAndUpdate(_id, dataProject, { new: true });

        res.json({
            ok: true,
            user: projectUpdate
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'No se ha podido actualizar el proyecto '
        })
    }
}

module.exports={
    getProjects,
    getProjectsAll,
    createProject,
    deleteProject,
    editProject,
    getProject,
    projectDashboard,
    completeProject

}