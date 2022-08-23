export interface Guild {
  id: string;
  name: string;
  character: string;
  invite: string;
  owner: string;
  advisor?: string;
  voter?: string;
}

export interface User {
  id: string;
  guilds: stirng[];
  roles: string[];
}

export default class Client {
  constructor(base: string, token?: string);
  
  fetchGuilds(): Promise<Guild[]>;
  createGuild(data): Promise<Guild>;
  fetchGuild(id): Promise<Guild>;
  editGuild(id, data): Promise<Guild>;
  deleteGuild(id): Promise<Guild>;

  fetchUsers(): Promise<User[]>;
  createUser(data): Promise<User>;
  fetchUser(id): Promise<User>;
  editUser(id, data): Promise<User>;
  deleteUser(id): Promise<User>;
  
  addUserGuild(id, guild): Promise<User>;
  removeUserGuild(id, guild): Promise<User|undefined>;

  addUserRole(id, role): Promise<User>;
  removeUserRole(id, role): Promise<User|undefined>;
}