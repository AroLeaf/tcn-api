export interface Guild {
  id: string;
  name: string;
  character: string;
  description?: string;
  invite: string;
  owner: string;
  advisor?: string;
  voter?: string;
}

export interface User {
  id: string;
  guilds: string[];
  roles: string[];
}

export interface Partner {
  name: string;
}

export type EventString = 
  | 'INIT'
  | 'GUILD_ADD'
  | 'GUILD_EDIT'
  | 'GUILD_REMOVE'
  | 'USER_ADD'
  | 'USER_EDIT'
  | 'USER_REMOVE'
  | 'USER_ROLE_ADD'
  | 'USER_ROLE_REMOVE'
  | 'USER_GUILD_ADD'
  | 'USER_GUILD_REMOVE'
  | 'PARTNER_ADD'
  | 'PARTNER_EDIT'
  | 'PARTNER_REMOVE'

export enum Events {
  Init = 'INIT',
  GuildAdd = 'GUILD_ADD',
  GuildEdit = 'GUILD_EDIT',
  GuildRemove = 'GUILD_REMOVE',
  UserAdd = 'USER_ADD',
  UserEdit = 'USER_EDIT',
  UserRemove = 'USER_REMOVE',
  UserRoleAdd = 'USER_ROLE_ADD',
  UserRoleRemove = 'USER_ROLE_REMOVE',
  UserGuildAdd = 'USER_GUILD_ADD',
  UserGuildRemove = 'USER_GUILD_REMOVE',
  PartnerAdd = 'PARTNER_ADD',
  PartnerEdit = 'PARTNER_EDIT',
  PartnerRemove = 'PARTNER_REMOVE',
}

export class Client {
  constructor(base: string, token?: string);

  connect(): Promise<void>;
  
  fetchGuilds(): Promise<Guild[]>;
  addGuild(data): Promise<Guild>;
  fetchGuild(id): Promise<Guild>;
  editGuild(id, data): Promise<Guild>;
  removeGuild(id): Promise<Guild>;

  fetchUsers(): Promise<User[]>;
  addUser(data): Promise<User>;
  fetchUser(id): Promise<User>;
  editUser(id, data): Promise<User>;
  removeUser(id): Promise<User>;
  
  addUserGuild(id, guild): Promise<User>;
  removeUserGuild(id, guild): Promise<User>;

  addUserRole(id, role): Promise<User>;
  removeUserRole(id, role): Promise<User>;

  on(event: 'INIT', listener: (client: this) => any): this;
  on(event: 'GUILD_ADD', listener: (guild: Guild) => any): this;
  on(event: 'GUILD_EDIT', listener: (guild: Guild) => any): this;
  on(event: 'GUILD_REMOVE', listener: (guild: Guild) => any): this;
  on(event: 'USER_ADD', listener: (user: User) => any): this;
  on(event: 'USER_EDIT', listener: (user: User) => any): this;
  on(event: 'USER_REMOVE', listener: (user: User) => any): this;
  on(event: 'USER_ROLE_ADD', listener: (user: User, role: string) => any): this;
  on(event: 'USER_ROLE_REMOVE', listener: (user: User, role: string) => any): this;
  on(event: 'USER_GUILD_ADD', listener: (user: User, guild: Guild | string) => any): this;
  on(event: 'USER_GUILD_REMOVE', listener: (user: User, guild: Guild | string) => any): this;
  on(event: 'PARTNER_ADD', listener: (partner: Partner) => any): this;
  on(event: 'PARTNER_EDIT', listener: (partner: Partner) => any): this;
  on(event: 'PARTNER_REMOVE', listener: (partner: Partner) => any): this;
}