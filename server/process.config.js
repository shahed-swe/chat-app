module.exports = {
    apps:[{
        name:'chat-app',
        script:'index.js',
        cwd:'/var/www/chat-app',
        env:{
            "NODE_ENV":'production',
            "PORT":"5000"
        }
    }]
}