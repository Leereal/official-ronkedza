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
];

export const postDefaultValues = {
  title: "",
  content: "",
  featured_image: "",
  scheduled_time: new Date(),
  is_published: false,
  is_scheduled: false,
};
