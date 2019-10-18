# 如何在一台电脑上同时使用Gitee和Github

gitee在国内，github在国外，有时候会需要静态页面访问速度快点，就需要配置两个账号。

### 创建 ssh key

```sh
# 进入用户目录下的 .ssh 文件夹下，路径会因你使用的操作系统不同而略有差异
# 没有这个文件夹也无所谓，直接运行下一句命令也可以
cd ~/.ssh

# 生成 key，将邮件地址替换为你 Gitee 或者 Github 使用的邮件地址
ssh-keygen -t rsa -C "xxx@xxx.com"
```

 接下来应该会看到下面的提示： 

```shell
Generating public/private rsa key pair.
Enter file in which to save the key (/c/Users/your_user_name/.ssh/id_rsa): id_rsa_gitee
```

 这一步如果默认回车，会生成名为 `id_rsa` 的文件，你可以输入不同的名字来便于识别文件，比如生成 Gitee 的 ssh key 可以设置为 `id_rsa_gitee`，设置 Github 的 ssh key 可以设置为 `id_rsa_github` ，我这里设置为 `id_rsa_gitee`。 

 接下来的会看到： 

```shell
Enter passphrase (empty for no passphrase):
```

 直接回车，然后会看到： 

```shell
Enter same passphrase again:
```

 继续回车就行了。生成完毕： 

```shell
Your identification has been saved in id_rsa_gitee.
Your public key has been saved in id_rsa_gitee.pub.
The key fingerprint is:
SHA256:F0K/ojCbFzgMPru11m4g/9uV03oHK+U0rKBLwOOye2c xxx@xxx.com
The key's randomart image is:
+---[RSA 2048]----+
|        .        |
|       . .       |
|  .     . o      |
| . + .   . o     |
|  o X . S o.     |
|  .+.O o.o o*    |
|  oo=o+. .+=.+   |
|   =++E. .oo+ .  |
|  ++.*=o. .o .   |
```

### 在 Gitee 和 Github 添加 public key

 找到用户目录下的 .ssh 文件夹，查看并复制创建好的 `id_rsa_gitee.pub` 或 `id_rsa_github.pub` 的内容。 

```shell
cd ~/.ssh
# 查看 id_rsa_gitee.pub 文件内容
cat id_rsa_gitee.pub
```

 会显示这样一串东西，复制它： 

```shell
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDZbvgUEj3XAXH4HkW27ibdXgV6VHdrA9/WdSDHtiiC55mjPvxj3OtPxIbpeJmhWyHiJWR6
uUuK+gkb//O51uWCPhHqxKR7+45tZ9jHqXW+hEKPp+odQgc+3hiHAjTkn3JGeIJlQp2UdJCDHBrp+kcgVeg91+y7cU3ufaUQ/hpD
rCgn6uvwjwJgnDhV9DYi+gFUFe7LUwa1o4nfwg43ycuOOuT7c6VO2dj/0pLRUVTPQYu/C3kaaPVedir7mKIu/dM6Ec44bhYTp1Dq
qp8BO42Cfo+n+dempqYTe2wcPvuDjSj884IATc/KvBfc86Yd2Uj7NI7li90Y3i6adoxUIWQh xxx@xxx.com
```

 打开 Gitee 和 Github 的网站找到设置，再找到 SSH Keys，添加复制的 public key 。 

![](https://img2018.cnblogs.com/blog/1635345/201908/1635345-20190820140215627-1057414887.png)

![](https://img2018.cnblogs.com/blog/1635345/201908/1635345-20190820140238740-813223982.png)



### 创建配置文件

 在 .ssh 文件夹中创建 config 文件，添加以下内容以区分两个 ssh key： 

```shell
# gitee
Host gitee.com
HostName gitee.com
PreferredAuthentications publickey
IdentityFile ~/.ssh/id_rsa_gitee

# github
Host github.com
HostName github.com
PreferredAuthentications publickey
IdentityFile ~/.ssh/id_rsa_github
```

### 测试连接是否正常

在命令行输入：

```shell
ssh -T git@github.com
```

若返回如下内容，则 Github 连接正常：

```shell
Hi yourname! You've successfully authenticated, but GitHub does not provide shell access.
```

继续在命令行输入：

```shell
ssh -T git@gitee.com
```

若返回如下内容，则 Gitee 连接正常。

```shell
Welcome to Gitee.com, yourname!
```



### 参考文章： 

[如何在一台电脑上同时使用Gitee（码云）和Github？](https://www.cnblogs.com/leyili/p/git_ssh_key.html)