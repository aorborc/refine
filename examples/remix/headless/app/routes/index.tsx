import { LoaderFunction } from "@remix-run/node";
import { requireUserId } from "~/session.server";

import { RemixRouteComponent } from "@pankod/refine-remix-router";

export const loader: LoaderFunction = async ({ params, request, context }) => {
    await requireUserId(request);

    return null;
};

export default RemixRouteComponent;

/**
 * To define a custom initial route for refine to redirect and start with:
 *
 * Bind the `initialRoute` value to the `RemixRouteComponent` like the following:
 *
 * export default RemixRouteComponent.bind({ initialRoute: "/posts" });
 *
 * Or, you can use `redirect` from `@remix-run/node` to redirect to a custom route within the loader function:
 *
 * import { json, LoaderFunction, redirect } from "@remix-run/node";
 *
 * export const loader: LoaderFunction = async ({ params, request, context }) => {
 *    return redirect("/posts");
 * };
 *
 **/
