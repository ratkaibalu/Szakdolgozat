import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, BaseRouteReuseStrategy, DetachedRouteHandle, RouteReuseStrategy } from "@angular/router";

@Injectable()
export class CustomRouterReuseStrategy extends RouteReuseStrategy {
    storedRouteHandles = new Map<string, DetachedRouteHandle>();

    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        return false;
    }
    store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
        if (route.routeConfig?.path) {
            this.storedRouteHandles.set(route.routeConfig.path, handle);
        }
    }
    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        return false;
    }
    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
        if (route.routeConfig?.path) {
            return this.storedRouteHandles.get(route.routeConfig.path) ?? {};
        }
        return {};
    }
    shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        return future.routeConfig === curr.routeConfig && future.params['memberId'] === curr.params['memberId'];
    }
}