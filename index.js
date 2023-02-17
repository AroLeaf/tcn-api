const WebSocket = require('ws');
const EventEmitter = require('events');


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
    if (!res.ok) throw Object.assign(new Error(res.status), await res.json());
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


const Events = {
  Init: 'INIT',
  GuildAdd: 'GUILD_ADD',
  GuildEdit: 'GUILD_EDIT',
  GuildRemove: 'GUILD_REMOVE',

  UserAdd: 'USER_ADD',
  UserEdit: 'USER_EDIT',
  UserRemove: 'USER_REMOVE',
  UserRoleAdd: 'USER_ROLE_ADD',
  UserRoleRemove: 'USER_ROLE_REMOVE',
  UserGuildAdd: 'USER_GUILD_ADD',
  UserGuildRemove: 'USER_GUILD_REMOVE',

  PartnerAdd: 'PARTNER_ADD',
  PartnerEdit: 'PARTNER_EDIT',
  PartnerRemove: 'PARTNER_REMOVE',
}

for (const key in Events) {
  Events[Events[key]] = key;
}


class Client extends EventEmitter {
  constructor(base, token) {
    super();
    this.base = base;
    this.token = token;
    this.rest = new Rest(base, token);
    this.guilds = new Map();
    this.users = new Map();
    this.parters = new Map();
  }


  async connect() {
    return new Promise((resolve, reject) => {
      this.socket = new WebSocket(`${this.base.replace('http', 'ws')}/socket`, {
        headers: { 'Authorization': this.token },
      });
      this.socket.on('open', resolve);
      this.socket.on('error', reject);
      this.socket.on('message', payload => {
        const { event, data } = JSON.parse(payload);
        
        switch (event) {
          case events.Init: {
            for (const guild of data.guilds) this.guilds.set(guild.id, guild);
            for (const user of data.users) this.users.set(user.id, user);
            for (const partner of data.partners) this.partners.set(partner.name, partner);
            return this.emit(event, this);
          }
  
          case events.GuildAdd: {
            this.guilds.set(data.id, data);
            return this.emit(event, data);
          }
  
          case events.GuildEdit: {
            const guild = this.guilds.get(data.id);
            Object.assign(guild, data);
            return this.emit(event, guild);
          }
  
          case events.GuildRemove: {
            const guild = this.guilds.get(data.id);
            this.guilds.delete(guild.id);
            return this.emit(event, guild);
          }
  
          case events.UserAdd: {
            this.users.set(data.id, data);
            return this.emit(event, data);
          }
  
          case events.UserEdit: {
            const user = this.users.get(data.id);
            Object.assign(user, data);
            return this.emit(event, user);
          }
  
          case events.UserRemove: {
            const user = this.users.get(data.id);
            this.users.delete(user.id);
            return this.emit(event, user);
          }
  
          case events.UserRoleAdd: {
            const user = this.users.get(data.user);
            user.roles.push(data.role);
            return this.emit(event, user, role);
          }
  
          case events.UserRoleRemove: {
            const user = this.users.get(data.user);
            const index = user.roles.indexOf(data.role);
            if (index > -1) user.roles.splice(index, 1);
            return this.emit(event, user, role);
          }
  
          case events.UserGuildAdd: {
            const user = this.users.get(data.user);
            user.guilds.push(data.guild);
            return this.emit(event, user, this.guilds.get(data.guild) || data.guild);
          }
  
          case events.UserGuildRemove: {
            const user = this.users.get(data.user);
            const index = user.guilds.indexOf(data.guild);
            if (index > -1) user.guilds.splice(index, 1);
            return this.emit(event, user, this.guilds.get(data.guild) || data.guild);
          }
  
          case events.PartnerAdd: {
            this.partners.set(data.name, data);
            return this.emit(event, data);
          }
  
          case events.PartnerEdit: {
            const partner = this.partners.get(data.name);
            Object.assign(partner, data);
            return this.emit(event, partner);
          }
  
          case events.PartnerRemove: {
            const partner = this.partners.get(data.name);
            this.partners.delete(partner.name);
            return this.emit(event, partner);
          }
        }
      });
    });
  }


  async fetchGuilds() {
    return this.rest.get('/guilds');
  }

  async addGuild(data) {
    return this.rest.post('/guilds', data);
  }
  
  async fetchGuild(id) {
    return this.rest.get('/guilds/' + id);
  }

  async editGuild(id, data) {
    return this.rest.patch('/guilds/' + id, data);
  }

  async removeGuild(id) {
    return this.rest.delete('/guilds/' + id);
  }

  
  async fetchUsers() {
    return this.rest.get('/users');
  }

  async addUser(data) {
    return this.rest.post('/users', data);
  }

  async fetchUser(id) {
    return this.rest.get('/users/' + id);
  }

  async editUser(id, data) {
    return this.rest.patch('/users/' + id, data);
  }

  async removeUser(id) {
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


  async fetchPartners() {
    return this.rest.get('/partners');
  }

  async addPartner(data) {
    return this.rest.post('/partners', data);
  }

  async fetchPartner(id) {
    return this.rest.get('/partners/' + id);
  }

  async editPartner(id, data) {
    return this.rest.patch('/partners/' + id, data);
  }

  async removePartner(id) {
    return this.rest.delete('/partners/' + id);
  }
}


module.exports = { Client, Events };