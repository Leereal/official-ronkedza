export const headerLinks = [
  {
    label: "Home",
    route: "/",
  },
  {
    label: "Dashboard",
    route: "/dashboard",
  },
  {
    label: "Create Post",
    route: "/posts/create",
  },
  {
    label: "My Profile",
    route: "/profile",
  },
  //TODO only show admin link if user is admin
  {
    label: "Settings",
    route: "/admin-settings",
  },
];

export const postDefaultValues = {
  title: "",
  content: "",
  is_published: false,
  categoryId: "",
  attachments: [],
};

export const pageDefaultValues = {
  socialId: "",
  accessToken: "",
};
export const socialPlatformDefaultValues = {
  name: "",
  slug: "",
  appID: "",
  appSecret: "",
  endpoint: "",
};
export const tokenDefaultValues = {
  about: "",
  accessToken: "",
  active: true,
  followers_count: 0,
  link: "",
  name: "",
  socialId: "",
  chatId: "",
  socialPlatform: "",
};
export const COLORS = {
  primary: "#39B5FF",
  secondary: "#03C167",
};
