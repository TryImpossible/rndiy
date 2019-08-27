/**
 *  This script is for auto migrate android source code to your git server
 *
 *  Environment Intro:
 *
 *  node v10.8.0
 *  repo version v1.12.37
 *        (from git://git.omapzoom.org/git-repo.git)
 *  repo launcher version 1.25
 *        (from /Users/barry/bin/repo)
 *  git version 2.17.2 (Apple Git-113)
 *  Python 2.7.15 (default, Jul 23 2018, 21:27:06)
 *  [GCC 4.2.1 Compatible Apple LLVM 9.1.0 (clang-902.0.39.2)]
 *
 *  Usage:
 *  node migrate.js
 */

const request = require('request');
const fs = require('fs');
const readline = require('readline');
const childprocess = require('child_process');

const validhttpstatuscode = Symbol(); // Symbol as function name, as private

/**
 * GitLab Api simple example
 * doc: https://gitlab.com/help/api/README.md
 */
class GitLabApi {
  constructor(baseUrl, token) {
    this.baseUrl = baseUrl; // GitLab Server Address
    this.headers = {
      'PRIVATE-TOKEN': token // GitLab Account Token
    };
  }

  [validhttpstatuscode](code) {
    return code >= 200 && code < 300;
  }

  /**
   * @returns Promise
   */
  groupList() {
    const url = `${this.baseUrl}/groups`;
    const options = {
      headers: this.headers
    };
    return new Promise((resolve, reject) => {
      request.get(url, options, (err, res, body) => {
        if (this[validhttpstatuscode](res.statusCode)) {
          console.log('--- group list query success ---');
          resolve(body);
        } else {
          console.log('--- group list query fail ---');
          reject(err);
        }
      });
    });
  }

  /**
   *
   * @param {*} group_name
   * @returns Promise
   */
  newGroup(group_name) {
    const group_path = group_name.charAt(0).toLowerCase() + group_name.slice(1);
    const url = `${this.baseUrl}/groups?name=${group_name}&path=${group_path}&visibility=private`;
    const options = {
      headers: this.headers
    };
    return new Promise((resolve, reject) => {
      request.post(url, options, (err, res, body) => {
        if (this[validhttpstatuscode](res.statusCode)) {
          console.log(`--- group: ${group_name}, create success ---`);
          resolve(body);
        } else {
          console.log(`--- group: ${group_name}, create fail ---`);
          reject(err);
        }
      });
    });
  }

  /**
   *
   * @param {*} id
   * @returns Promise
   */
  delGroup(id) {
    const url = `${this.baseUrl}/groups/${id}`;
    const options = {
      headers: this.headers
    };
    return new Promise((resolve, reject) => {
      request.delete(url, options, (err, res, body) => {
        if (this[validhttpstatuscode](res.statusCode)) {
          console.log(`group: ${id}, delete success`);
          resolve(body);
        } else {
          console.log(`group: ${id}, delete fail`);
          reject(err);
        }
      });
    });
  }

  /**
   * @returns Promise
   */
  projectList() {
    const url = `${this.baseUrl}/projects`;
    const options = {
      headers: this.headers
    };
    return new Promise((resolve, reject) => {
      request.get(url, options, (err, res, body) => {
        if (this[validhttpstatuscode](res.statusCode)) {
          console.log('--- project list query success ---');
          resolve(body);
        } else {
          console.log('--- project list query fail ---');
          reject(err);
        }
      });
    });
  }

  /**
   *
   * @param {*} group_id
   * @param {*} name
   * @returns Promise
   */
  newProject(group_id, name) {
    const url = group_id
      ? `${this.baseUrl}/projects?namespace_id=${group_id}&name=${name}`
      : `${this.baseUrl}/projects?name=${name}`;
    const options = {
      headers: this.headers
    };
    return new Promise((resolve, reject) => {
      request.post(url, options, (err, res, body) => {
        if (this[validhttpstatuscode](res.statusCode)) {
          console.log(`project: ${name}, create success`);
          resolve(body);
        } else {
          console.log(`project: ${name}, create fail`);
          reject(err);
        }
      });
    });
  }

  /**
   *
   * @param {*} id
   * @returns Promise
   */
  delProject(id) {
    const url = `${this.baseUrl}/projects/${id}`;
    const options = {
      headers: this.headers
    };
    return new Promise((resolve, reject) => {
      request.delete(url, options, (err, res, body) => {
        if (this[validhttpstatuscode](res.statusCode)) {
          console.log(`project: ${id}, delete success`);
          resolve(body);
        } else {
          console.log(`project: ${id}, delete fail`);
          reject(err);
        }
      });
    });
  }

  /**
   * @returns Promise
   */
  userList() {
    const url = `${this.baseUrl}/users`;
    const options = {
      headers: this.headers
    };
    return new Promise((resolve, reject) => {
      request.get(url, options, (err, res, body) => {
        if (this[validhttpstatuscode](res.statusCode)) {
          console.log('--- user list query success ---');
          resolve(body);
        } else {
          console.log('--- user list query fail ---');
          reject(err);
        }
      });
    });
  }

  /**
   *
   * @param {*} username
   * @returns Promise
   */
  userInfo(username) {
    const url = `${this.baseUrl}/users?$search=${username}`;
    const options = {
      headers: this.headers
    };
    return new Promise((resolve, reject) => {
      request.get(url, options, (err, res, body) => {
        if (this[validhttpstatuscode](res.statusCode)) {
          console.log('--- userinfo query success ---');
          resolve(body);
        } else {
          console.log('--- userinfo query fail ---');
          reject(err);
        }
      });
    });
  }

  /**
   *
   * @param {*} password
   * @param {*} email
   * @param {*} username
   * @param {*} name
   * @returns Promise
   */
  newUser(password, email, username, name) {
    const url = `${baseUrl}/users?password=${password}&email=${email}&username=${username}&name=${name}`;
    const options = {
      headers: this.headers
    };
    request.post(url, options, (err, res, body) => {
      if (this[validhttpstatuscode](res.statusCode)) {
        console.log('--- add user success ---');
        resolve(body);
      } else {
        console.log('--- add user fail ---');
        reject(err);
      }
    });
  }

  /**
   *
   * @param {*} id
   * @returns Promise
   */
  delUser(id) {
    const url = `${this.baseUrl}/users/${id}`;
    const options = {
      headers: this.headers
    };
    return new Promise((resolve, reject) => {
      request.delete(url, options, (err, res, body) => {
        if (this[validhttpstatuscode](res.statusCode)) {
          console.log(`--- user: ${id}, delete success ---`);
          resolve(body);
        } else {
          console.log(`--- user: ${id}, delete fail ---`);
          reject(err);
        }
      });
    });
  }
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
class Utils {
  static input(question, isClose = false) {
    if (!rl) rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise((resolve, reject) => {
      rl.question(question, answer => {
        if (isClose) rl.close();
        resolve(answer);
      });
    });

    // // --- simple example ---
    // if (!rl) rl = readline.createInterface({ input: process.stdin, output: process.stdout, prompt: '请输入' });
    // rl.prompt();
    // rl.on('line', line => {
    //   console.log(line);
    //   resolve(line);
    //   rl.close();
    // }).on('close', () => {
    //   console.log('close');
    //   process.exit();
    // });
  }
  /**
   * get projectname
   * @returns Promise
   */
  static getProjectNameList() {
    const path = `${__dirname}/manifest.xml`;
    const xml = fs.readFileSync(path).toString();
    let list = [];
    const names = xml.match(/<project.+/g);
    for (let i = 0; i < names.length; i++) {
      list.push(names[i].match(/name="\w+"/g)[0].replace(/name="|"/g, ''));
    }
    console.log(`--- repo project list: total ${list.length} ---\n`, list);
    return list;

    // // --- async ---
    // const path = `${__dirname}/manifest.xml`;
    // const rl = readline.createInterface({ input: fs.createReadStream(path) });
    // const list = [];
    // return new Promise((resolve, reject) => {
    //   rl.on('line', line => {
    //     try {
    //       if (line.includes('<project')) {
    //         const name = line.match(/name="\w+"/g)[0].replace(/name="|"/g, '');
    //         list.push(name);
    //       }
    //     } catch (error) {
    //       reject(error);
    //     }
    //   });
    //   rl.on('close', () => {
    //     console.log(`--- repo project list: total ${list.length} ---\n`, list);
    //     resolve(list);
    //   });
    // });
  }

  /**
   * run cmd
   * @param {*} cmd
   * @returns Promise
   */
  static execCmd(cmd) {
    // --- sync ---
    try {
      const result = childprocess.execSync(cmd).toString();
      console.log(`--- "${cmd}", exec success ---`);
      return result;
    } catch (error) {
      console.log(`--- "${cmd}", exec fail ---`);
      console.log(error);
      return null;
    }

    // // --- async ---
    //   return new Promise((resolve, reject) => {
    //     childprocess.exec(cmd, (error, stdout, stderr) => {
    //       if (!error) {
    //         console.log(`"${cmd}", exec success`);
    //         resolve(stdout);
    //       } else {
    //         console.log(`--- "${cmd}", exec fail ---`);
    //         reject(stderr);
    //       }
    //     });
    //   });
  }
}

async function start() {
  // 1. init args
  let gitlab_api_url = await Utils.input(
    'please input your gitlab api address ? default: http://192.168.1.52/api/v4 \n'
  );
  if (!gitlab_api_url) gitlab_api_url = 'http://192.168.1.52/api/v4';

  let gitlab_account_private_token = await Utils.input(
    'please input your gitlab account private-token ? default: 7Rz-JMd8CuXMry2_zsam \n'
  );
  if (!gitlab_account_private_token) gitlab_account_private_token = '7Rz-JMd8CuXMry2_zsam';

  let gitlab_group_name = await Utils.input('please input your gitlab group name ? default: Android-x86-6.0 \n');
  if (!gitlab_group_name) gitlab_group_name = 'Android-x86-6.0';

  let gitlab_group_workspace_url = await Utils.input(
    'please input your gitlab group workspace url ? default: git@192.168.1.52:android-x86-6.0 \n'
  );
  if (!gitlab_group_workspace_url) gitlab_group_workspace_url = 'git@192.168.1.52:android-x86-6.0';

  local_workspace_url = await Utils.input(
    'please input your local workspace url ? default: /Volumes/AndroidSystem/marshmallow-x86 \n',
    true
  );
  if (!local_workspace_url) local_workspace_url = '/Volumes/AndroidSystem/marshmallow-x86';

  // 2. batch create project
  const api = new GitLabApi(gitlab_api_url, gitlab_account_private_token);
  const res = await api.newGroup(gitlab_group_name);
  const { id } = JSON.parse(res);
  const names = Utils.getProjectNameList();
  names.push('manifest'); // remeber create manifest project
  const result = await Promise.all(names.map(name => api.newProject(id, name)));

  if (result) {
    // 3. create manifest
    Utils.execCmd(`cd ${local_workspace_url} && git clone ${gitlab_group_workspace_url}/manifest.git`);
    const manifestData = fs.readFileSync(`${__dirname}/manifest.xml`).toString();
    fs.writeFileSync(`${local_workspace_url}/manifest/default.xml`, manifestData);
    const migrateData = fs.readFileSync(`${__dirname}/migrate.js`).toString();
    fs.writeFileSync(`${local_workspace_url}/manifest/migrate.js`, migrateData);
    fs.writeFileSync(`${local_workspace_url}/manifest/.gitignore`, '.DS_Store');
    Utils.execCmd(`cd ${local_workspace_url}/manifest && git add . && git commit -m 'Initial commit' && git push`);
    names.pop(); // create manifest success, remeber remove manifest project from names

    // 4. del local .repo folder
    if (fs.existsSync(`${local_workspace_url}/.repo`)) {
      Utils.execCmd(`rm -rf ${local_workspace_url}/.repo`);
    }

    // 5. del local git info
    let result = Utils.execCmd(`find ${local_workspace_url} -name '.gitignore' -or -name '.git'`);
    result = result.split('\n'); // string transform arry
    result.forEach(path => {
      if (path.replace(/(^\s*)|(\s*$)/g, '') && !path.startsWith('./manifest')) {
        const stat = fs.statSync(path);
        if (stat.isDirectory()) {
          Utils.execCmd(`rm -rf ${path}`);
        } else if (stat.isFile()) {
          Utils.execCmd(`mv ${path} ${path}.bak`);
        }
      }
    });

    // 6. push soruce code
    names.forEach(async name => {
      const dirs = fs.readdirSync(`${local_workspace_url}/${name}`);
      if (dirs.includes('.git')) {
        console.log(`--- del default .git folder in ${name} ---`);
        Utils.execCmd(`rm -rf ${local_workspace_url}/${name}/.git`);
      }
      if (!dirs.includes('.gitignore')) {
        console.log(`--- create .gitignore file in ${name} ---`);
        fs.writeFileSync(`${local_workspace_url}/${name}/.gitignore`, '.DS_Store');
      }
      // const cmd = `cd ${local_workspace_url}/${name} && git init && git remote add origin ${gitlab_group_workspace_url}/${name}.git && git add . && git commit -m 'Initial commit' && git push -u origin master`;
      Utils.execCmd(`cd ${local_workspace_url}/${name} && git init`);
      Utils.execCmd(
        `cd ${local_workspace_url}/${name} && git remote add origin ${gitlab_group_workspace_url}/${name}.git`
      );
      Utils.execCmd(`cd ${local_workspace_url}/${name} && git add .`);
      Utils.execCmd(`cd ${local_workspace_url}/${name} && git commit -m 'Initial commit'`);
      Utils.execCmd(`cd ${local_workspace_url}/${name} && git push -u origin master`);
    });

    // 7. repo init from your gitlab
    Utils.execCmd(
      `cd ${local_workspace_url} && repo init -u ${gitlab_group_workspace_url}/manifest.git && repo sync --force-sync`
    );
    console.log('--- congratulations，migrate success ----');
  }
}
start();
