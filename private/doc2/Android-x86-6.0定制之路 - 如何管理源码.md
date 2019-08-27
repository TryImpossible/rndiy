## 前言

终于完成了 android-x86-6.0 源码的编译工作，经过简单的测试，系统正常工作，接下来就是阅读和修改源码了。为了方便修改、提交、测试源码，想着应该将源码上传到 git，但是源码过于庞大，如果将整个源码作为单个项目上传 git 的话，必将造成每次同步都非常慢。想了下，觉得应该跟官方一样采用 repo 管理源码，将源码拆成多个项目去维护。

## 搭建 GitLab 服务

想了下，还是先在服务器上搭建 GitLab 来管理源码，如果以后有必要的话再迁移到公司的 GitLab 上去，现在就当练手吧。

### 更新软件源

```
supo apt-get update
```

### 安装 openssl

```
sudo apt-get install -y curl openssh-server ca-certificates
```

### 安装 postfix

这里是配置邮件服务，选择“Internet Site”并按 Enter 键，其他选择则默认

```
sudo apt-get install -y postfix
```

### 添加 GitLab 包

这里选择 GitLab 社区版（CE），GitLab 企业版（EE）好像是收费的

```
curl https://packages.gitlab.com/install/repositories/gitlab/gitlab-ce/script.deb.sh | sudo bash
```

### 安装 GitLab

```
sudo EXTERNAL_URL="http://gitlab.example.com" apt-get install gitlab-ce
```

安装成功：

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190321104602820.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0N0cmxfUw==,size_16,color_FFFFFF,t_70)

**注意** 将`http://gitlab.example.com`更改为要访问 GitLab 实例的 URL，这里我更改为`http://192.168.1.52`

**关于如何卸载 GitLab**

```
# 停止gitlab
sudo gitlab-ctl stop

# 查看进程
ps -e | grep gitlab

# 删除所有包含gitlab的文件及目录
find / -name gitlab | xargs rm -rf

# 卸载
sudo apt-get remove gitlab-ee

# 检查还有没有卸载的gitlab相关软件
dpkg --get-selections | grep gitlab
gitlab-ee deinstall

# 再执行
sudo apt-get --purge remove gitlab-ee
```

### 登录 GitLab

在浏览器访问`http://192.168.1.52`，首次访问是以 root 用户登录需要设置用户密码。

这样 GitLab 的服务，基本就搭建完成了。

### 修改 GitLab 配置

如果需要修改有关 GitLab 服务的相关配置，比如说修改访问 GitLab 域名等

执行`vi /etc/gitlab/gitlab.rb`，编译配置文件

编辑完成后，执行`sudo gitlab-ctl reconfigure`，让配置生效

### 添加账号

因为使用邮件注册账号太过繁琐，直接切换到 Root 用户创建账号。先创建两个账号，一个给我的 Mac Pro 使用，另一个 给 Ubuntu 服务器使用，并且都赋予管理员的权限。创建完成后，登录并且[设置 SSH Keys](https://blog.csdn.net/Ctrl_S/article/details/82691132)

## 上传源码至 GitLab

**参考文档**

[Repo 介绍](https://blog.csdn.net/nwpushuai/article/details/78778602)

[Repo 管理多个 git 仓库](https://www.zhihu.com/question/41440585)

### 创建 manifest.git

manifest.git 仓库是一个项目清单库，用来管理 android-x86-6.0 源码中的 git 仓库，里面标明了远程仓库地址、 项目仓库的名称和本地路径等信息

1.在 GitLab 上创建名为 Android-x86-6.0 的项目组， 创建名为 manifest 的空仓库

2.执行`cd ~/android-x86-6.0`指令，切换到源码文件夹

3.执行`git@192.168.1.52:android-x86-6.0/manifest.git`，克隆仓库

4.执行`cd manfiest`指令切换到 manfiest 文件夹，创建 `default.xml` 文件，并且编写使用 repo 管理的 git 仓库的名称、仓库在本地的路径和仓库的 url 地址

下面是我的`default.xml`内容，仅供参考：

```
<?xml version="1.0" encoding="UTF-8" ?>

<manifest>
    <remote name="origin" fetch="." />  <!-- ".", 表示使用repo init -u url里的url,这里指 git@192.168.1.52:android-x86-6.0/ -->
    <default remote="origin" revision="master"/>
    <project path="abi" name="abi"/>
    <project path="art" name="art"/>
    <project path="bionic" name="bionic"/>
    <project path="bootable" name="bootable"/>
    <project path="build" name="build">
      <copyfile dest="Makefile" src="core/root.mk"/>
    </project>
    <project path="dalvik" name="dalvik"/>
    <project path="development" name="development"/>
    <project path="device" name="device"/>
    <project path="external" name="external"/>
    <project path="frameworks" name="frameworks"/>
    <project path="hardware" name="hardware"/>
    <project path="kernel" name="kernel"/>
    <project path="libcore" name="libcore"/>
    <project path="libnativehelper" name="libnativehelper"/>
    <project path="ndk" name="ndk"/>
    <project path="packages" name="packages" />
    <project path="platform_testing" name="platform_testing"/>
    <project path="prebuilts" name="prebuilts"/>
    <project path="sdk" name="sdk"/>
    <project path="system" name="system"/>
</manifest>
```

remote 节点中 fetch： 表示远程仓库的 url，这里的 url 是指整个源码项目的名称，像 `git@192.168.1.52:android-x86-6.0/`这样

project 节点中 path： 表示仓库在本地的相对路径，是以 manifest 文件夹位置为准的

project 节点中 name： 表示仓库的名称，这个名称为创建仓库时的名称。这里将 name 与 remote 节点中 fetch 拼接就是仓库的 url，像`git@192.168.1.52:android-x86-6.0/abi.git`这样

default： 表示默认的远程链接为 origin，默认的同步的分支为 master

5.执行`git add . && git commit -m 'Initial commit' && git push`指令，将`default.xml`文件推送到服务器上

这样，manifest.git 仓库的创建就算基本完成了

### 批量上传项目

前面创建`default.xml` 时已经将源码工程拆分成 20 个子项目，现在就是怎样批量去上传这 20 个项目了，而且上传项目前，还要在 GitLab 上创建 20 个空的仓库。如果这些工作手动来操作的话，那就太 Low 了，得写脚本来自动执行。

下面是我用 Node.js 编写的脚本，主要是用来自动迁移源码工程至 GitLab 服务器

**GitLabApi**

GitLabApi 类，主要调用 Api 创建项目、创建用户等

```
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
```

**Utils**

Utils 类主要是查询项目列表、执行 Linux 指令等

```
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
```

**start**

start 方法就是脚本的入口，为了人性化，脚本编写为终端可交互型的，通过问答式接收参数。

```
async function start() {
  // 1. init args
  let gitlab_api_url = await Utils.input(
    'please input your gitlab api address ? default: http://192.168.1.52/api/v4 \n'
  );
  if (!gitlab_api_url) gitlab_api_url = 'http://192.168.1.52/api/v4';

  let gitlab_account_private_token = await Utils.input(
    'please input your gitlab account private-token ? default: R1G9zxaXG-a9rbrp-ZZA \n'
  );
  if (!gitlab_account_private_token) gitlab_account_private_token = 'R1G9zxaXG-a9rbrp-ZZA';

  let gitlab_group_name = await Utils.input('please input your gitlab group name ? default: Android-x86-6.0 \n');
  if (!gitlab_group_name) gitlab_group_name = 'Android-x86-6.0';

  let gitlab_group_workspace_url = await Utils.input(
    'please input your gitlab group workspace url ? default: git@192.168.1.52:android-x86-6.0 \n'
  );
  if (!gitlab_group_workspace_url) gitlab_group_workspace_url = 'git@192.168.1.52:android-x86-6.0';

  local_workspace_url = await Utils.input(
    'please input your local workspace url ? default: /Users/barry/Android/SourceCode/android-x86-6.0 \n',
    true
  );
  if (!local_workspace_url) local_workspace_url = '/Users/barry/Android/SourceCode/android-x86-6.0';

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
```

**说明** 此脚本需要在 node.js 的环境运行，终端下执行`node migrate.js`即可

大概就这么多，此脚本经个人测试过，完美的将整个 Android-x86-6.0 的源码上传至 GitLab 服务器。

如果需要完整的脚本，请前往[下载](https://download.csdn.net/download/ctrl_s/11021846)

### 从 GitLab 下载源码

前面终于把 Android-x86-6.0 的源码上传到 GitLab，现在需要在 Ubuntu 服务器上下载 Android-x86-6.0 的源码

1.安装 git 工具

2.安装 repo 工具

3.GitLab 配置 SSH Keys

4.执行`repo init -u git@192.168.1.52:android-x86-6.0/manifest.git`初始化初始化仓库

5.执行`repo sync`指令同步源码

## 总结

这样整个 Android-x86-6.0 的源码迁移工作就完成了，当中学习了 GitLab 服务的搭建和 NodeJS 的知识，特别是加强了编写脚本的能力，算是点小收获。同时，以后也要多写脚本，拒绝做重复的工作。
