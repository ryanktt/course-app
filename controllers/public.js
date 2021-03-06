const Course = require('../models/course');
const Class = require('../models/class');
const Content = require('../models/content');

exports.getCourses = async (req, res) => {
    try {
        const courses = await Course.find({}).sort({'createdAt': -1});

        res.json(courses)
    } catch (err) {
        console.error(err);
        res.status(500).json('Erro de Servidor');
    }

};

exports.getCourse = async(req, res) => {
    const courseId = req.params.id;

    try {
        const [courseData, classes] = await Promise.all([
            Course.findById(courseId).select('title description'),
            Class.find({course: courseId}).select('title')
        ]);
        const course = {
            title: courseData.title, 
            description: courseData.description,
            classes
        };

        res.json(course);
    } catch (err) {
        console.error(err);
        res.status(500).json('Erro de Servidor');
    }
}

exports.getClass = async(req, res) => {
    const classId = req.params.id;

    try {
        let [classData, content] = await  Promise.all([
            Class.findById(classId).lean(),
            Content.findOne({class: classId}).lean()
        ]);
     
        let url = classData.video;

        if(url.includes('https://youtu.be/')) {
            url = url.replace('https://youtu.be/', 'https://www.youtube.com/embed/')
        }
        if(url.includes('www.youtube.com')) {
            url = url.replace('www.youtube.com', 'www.youtube.com/embed/')
            
            url = url.replace('/watch?v=', '');
        }

        if(!url.includes('https://youtu.be/') &&
        !url.includes('https://www.youtube.com/embed/') &&
        !url.includes('www.youtube.com')) {
            url =  'https://www.youtube.com/embed/';
        }
        classData.video = url;
        
        res.json({...classData, content});
        
    } catch (err) {
        console.error(err);
        res.status(500).json('Erro de Servidor');
    }
}

