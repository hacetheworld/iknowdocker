# 🐳 Docker — Practical Guide (From First Principles)

This guide is written for software engineers who want to **understand Docker deeply** and also **use it correctly in production**.

No buzzwords. Just what actually matters.

---

# 🚀 What Is Docker (Real Understanding)

Docker does **NOT** create a virtual machine.

It simply runs your application as a:

> **Normal Linux process with isolation + custom filesystem**

That’s it.

---

## 🧠 Mental Model

* **Image** → Read-only snapshot of your app + environment
* **Container** → Running process from that image
* **Dockerfile** → Instructions to build that snapshot

---

# 📦 What Is an Image?

An image is a **stack of layers**:

Example:

```
Base OS (Alpine Linux)
+ Node.js installed
+ Dependencies installed
+ Your source code
```

Each step in Dockerfile = new layer.

Images are:

* Immutable (cannot change after build)
* Reproducible (same image = same behavior)

---

# ⚙️ What Is a Container?

A container is:

> A running process using that image

When it starts:

* Gets isolated filesystem
* Gets limited resources (CPU/RAM)
* Runs your app

If the process stops → container stops

---

# 🧱 Basic Dockerfile (Node.js Example)

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm", "start"]
```

---

# 🔍 What Each Step Does

### `FROM node:20-alpine`

Base filesystem + Node runtime
(You are NOT creating an OS from scratch)

---

### `WORKDIR /app`

Sets working directory inside container

---

### `COPY package*.json ./`

Copies only dependency files

---

### `RUN npm install`

Installs dependencies **inside the image**

👉 Important:

* Happens during build
* Creates `node_modules` inside image
* NOT using your local `node_modules`

---

### `COPY . .`

Copies your source code

---

### `CMD ["npm", "start"]`

Runs when container starts

👉 Difference:

* `RUN` → build time
* `CMD` → runtime

---

# 🚫 .dockerignore (VERY IMPORTANT)

Example:

```
node_modules
.git
.env
dist
```

Why?

* Prevents copying unnecessary files
* Avoids OS mismatch issues
* Keeps image small
* Protects secrets

---

# 🧪 Build & Run

### Build image

```bash
docker build -t my-app .
```

### Run container

```bash
docker run -p 8080:8080 my-app
```

Now your app runs on:

```
http://localhost:8080
```

---

# 🧠 Key Concepts You MUST Understand

## 1. Containers Share Kernel

* No separate OS
* Faster than VMs
* Same host kernel is used

---

## 2. Memory Is Shared

* All containers use host RAM
* You can limit it:

```bash
docker run -m 512m my-app
```

---

## 3. Filesystem Is Layered

* Image = read-only layers
* Container = adds writable layer
* Changes disappear when container is deleted

---

## 4. Containers Are Ephemeral

* Data is lost unless stored externally
* Use volumes for persistence

---

# 📁 Volumes (Data Persistence)

Example:

```bash
docker run -v mydata:/app/data my-app
```

Now data survives container restarts.

---

# 🌐 Networking Basics

* Each container gets its own internal IP
* Docker creates a virtual network

Port mapping:

```bash
docker run -p 8080:8080 my-app
```

Means:

```
Host:8080 → Container:8080
```

---

# 🧩 Docker Compose (Multi-Service Apps)

Used when you have:

* Backend
* Database
* Redis

Example:

```yaml
version: "3"

services:
  app:
    build: .
    ports:
      - "8080:8080"

  db:
    image: postgres
```

Run everything:

```bash
docker-compose up
```

---

# 🏗 Production Best Practices

## 1. Build Once, Run Anywhere

Never install dependencies at runtime.

✅ Good:

```dockerfile
RUN npm install
```

❌ Bad:

```dockerfile
CMD npm install && npm start
```

---

## 2. Use Environment Variables

DO NOT hardcode secrets.

Example:

```bash
docker run -e DB_URL=xyz my-app
```

In code:

```js
process.env.DB_URL
```

---

## 3. Use `.env` Carefully

Never include `.env` in image.

Use runtime injection:

* Docker run
* Docker Compose
* Cloud environment variables

---

## 4. Keep Images Small

Use lightweight base images:

```dockerfile
node:alpine
```

---

## 5. Use Multi-Stage Builds (Advanced)

Reduces final image size.

---

## 6. Don’t Store Data Inside Container

Use:

* Volumes
* External DB

---

## 7. Handle Signals Properly

Use:

```dockerfile
CMD ["node", "server.js"]
```

Instead of:

```dockerfile
CMD npm start
```

Why:

* Proper shutdown handling
* Better process control

---

## 8. Avoid Running as Root

(Advanced but important)

---

# 🚀 Deployment Flow (Simple)

1. Build image
2. Push to registry
3. Pull on server
4. Run container

Example:

```bash
docker build -t my-app .
docker push my-app
```

On server:

```bash
docker pull my-app
docker run -d -p 80:8080 my-app
```

---

# 🧠 Final Mental Model

* Docker = Process isolation + filesystem snapshot
* Image = Blueprint
* Container = Running instance
* Build phase = prepare everything
* Run phase = just execute

---

# 🎯 Goal

If you follow this:

* Your app will run consistently everywhere
* No “works on my machine” issues
* Production deployments become predictable

---

## Follow @hacetheworld 
