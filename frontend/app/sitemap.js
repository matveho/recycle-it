const staticRoutes = [
    "/",
    "/about",
    "/join-us",
    "/support-us",
    "/calendar",
];

export default function sitemap() {
    const baseUrl = "https://uara.ca";

    const routes = staticRoutes.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date().toISOString(),
    }));

    return routes;
}
