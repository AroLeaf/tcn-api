class Rest {
  constructor(base, token) {
    this.base = base;
    this.token = token;
  }

  async #withData(method, url, data) {
    return fetch(url, {
      method,
      body: JSON.stringify(data),
      headers: {
        'Authorization': this.token,
        'Content-Type': 'application/json',
      },
    }).then(this.#parseContent);
  }

  async #withoutData(method, url) {
    return fetch(url, {
      method,
      headers: this.token ? { 'Authorization': this.token }: {},
    }).then(this.#parseContent);
  }

  async #parseContent(res) {
    if (!res.ok) throw Object.assign(new Error(res.status), { response: res });
    return res.status !== 204 && res.json();
  }

  async post(ep, data) {
    return this.#withData('POST', this.base + ep, data);
  }

  async put(ep, data) {
    return this.#withData('PUT', this.base + ep, data);
  }
  
  async get(ep) {
    return this.#withoutData('GET', this.base + ep);
  }

  async patch(ep, data) {
    return this.#withData('PATCH', this.base + ep, data);
  }

  async delete(ep, data) {
    return data
      ? this.#withData('DELETE', this.base + ep, data)
      : this.#withoutData('DELETE', this.base + ep);
  }
}


class Client {
  constructor(base, token) {
    this.rest = new Rest(base, token);
    this.base = base;
    this.token = token;
  }


  async fetchGuilds() {
    return this.rest.get('/guilds');
  }

  async createGuild(data) {
    return this.rest.post('/guilds', data);
  }
  
  async fetchGuild(id) {
    return this.rest.get('/guilds/' + id);
  }

  async editGuild(id, data) {
    return this.rest.patch('/guilds/' + id, data);
  }

  async deleteGuild(id) {
    return this.rest.delete('/guilds/' + id);
  }

  
  async fetchUsers() {
    return this.rest.get('/users');
  }

  async createUser(data) {
    return this.rest.post('/users', data);
  }

  async fetchUser(id) {
    return this.rest.get('/users/' + id);
  }

  async editUser(id, data) {
    return this.rest.patch('/users/' + id, data);
  }

  async deleteUser(id) {
    return this.rest.delete('/users/' + id);
  }
  

  async addUserGuild(id, guild) {
    return this.rest.put(`/users/${id}/guilds`, { guild });
  }

  async removeUserGuild(id, guild) {
    return this.rest.delete(`/users/${id}/guilds`, { guild });
  }


  async addUserRole(id, role) {
    return this.rest.put(`/users/${id}/roles`, { role });
  }

  async removeUserRole(id, role) {
    return this.rest.delete(`/users/${id}/roles`, { role });
  }
}


module.exports = Client;