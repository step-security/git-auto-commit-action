/**
 * Most of this code has been copied from the following GitHub Action
 * to make it simpler or not necessary to install a lot of
 * JavaScript packages to execute a shell script.
 *
 * https://github.com/ad-m/github-push-action/blob/fe38f0a751bf9149f0270cc1fe20bf9156854365/start.js
 */

const spawn = require('child_process').spawn;
const path = require("path");
const axios = require('axios');

async function validateSubscription() {
    const API_URL = `https://agent.api.stepsecurity.io/v1/github/${process.env.GITHUB_REPOSITORY}/actions/subscription`;
  
    try {
      await axios.get(API_URL, {timeout: 3000});
    } catch (error) {
      if (error.response) {
        console.error(
          'Subscription is not valid. Reach out to support@stepsecurity.io'
        );
        process.exit(1);
      } else {
        core.info('Timeout or API not reachable. Continuing to next step.');
      }
    }
  }

const exec = (cmd, args=[]) => new Promise((resolve, reject) => {
    console.log(`Started: ${cmd} ${args.join(" ")}`)
    const app = spawn(cmd, args, { stdio: 'inherit' });
    app.on('close', code => {
        if(code !== 0){
            err = new Error(`Invalid status code: ${code}`);
            err.code = code;
            return reject(err);
        };
        return resolve(code);
    });
    app.on('error', reject);
});

const main = async () => {
    await validateSubscription();
    await exec('bash', [path.join(__dirname, './entrypoint.sh')]);
};

main().catch(err => {
    console.error(err);
    console.error(err.stack);
    process.exit(err.code || -1);
})
