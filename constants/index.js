export const headerLinks = [
  {
    label: "Home",
    route: "/",
  },
  {
    label: "Create Post",
    route: "/posts/create",
  },
  {
    label: "My Profile",
    route: "/profile",
  },
  {
    label: "Dashboard",
    route: "/dashboard",
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
  featured_image: "",
  scheduled_time: new Date(),
  is_published: false,
  is_scheduled: false,
  categoryId: "",
};

export const pageDefaultValues = {
  pageId: "",
  accessToken: "",
};
export const socialPlatformDefaultValues = {
  name: "",
  slug: "",
  appID: "",
  appSecret: "",
  endpoint: "",
};
export const COLORS = {
  primary: "#39B5FF",
  secondary: "#03C167",
};
