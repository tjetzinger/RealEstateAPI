const env = process.argv[process.argv.indexOf('--env') + 1];
const isProd = env === 'prod';

module.exports = {
    apps : [{
        name: isProd ? 'RealEstateAPI-Prod' : 'RealEstateAPI-Int',
        script: 'npm',
        args: '-- start',
        // instances: isProd ? 'max' : 1,
        // exec_mode : isProd ? 'cluster' : 'fork',
        watch: true,
        ignore_watch : ["node_modules", "logs"],
        instance_var: '0',
        error_file: 'logs/error.log',
        out_file: 'logs/output.log',
        env_int: {
            "NODE_ENV": 'int'
        },
        env_prod : {
            "NODE_ENV": 'prod'
        }
    }]
};
