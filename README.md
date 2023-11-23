<h1 align="center">
  🛠 Twitch node for <code>n8n</code>
</h1>

<p align="center">
  Receive notifications when something happens in your Twitch Stream (or other's). Installing this node you'll be able to trigger automations based on "Stream goes online/offline", "new follow" and some other events.
  <br />
  <br />
  Take a look, play and have fun with this.
  <a href="https://github.com/r3-dev/n8n-nodes-twitch/stargazers">Stars are welcome 😊</a>
</p>

# 👀 Usage example

Usually all the nodes you need for a certain task are already included with n8n.
They take care of the new additions via PR and, at some point, they get added to the core packages.

There is an alternative way that is creating an npm package with just the component you want to add and install it in the n8n instance you have, which is the recommended way for custom packages that are going to be used only in your context/company/environment.

So, if you already have a n8n instance running, you could jump to the installation part and follow the instructions.

Once it's installed, it will appear in the components palette, as any other component:

![Component palette with Twitch Trigger Node](/docs/components.png)

![Trigger node options in workflow](/docs/trigger_options.png)

# 👍 How to install

Just go to your n8n instance, find the folder where n8n is installed (if you are using the standard Docker installation, it will probably be: /usr/local/lib/node_modules/n8n) and install the package as any other npm package:

- Npm: `npm i @r3-dev/n8n-nodes-twitch`
- Yarn: `yarn add @r3-dev/n8n-nodes-twitch`
- Pnpm: `pnpm add @r3-dev/n8n-nodes-twitch`

If you want to create a custom Docker image to have it installed by default (that's what we do), you could use our Dockerfile as a base.
