import { Project } from './model';
import { observable, configure } from 'mobx';
import icon from './icon';

export * from './model';

export class Store {
	@observable projects: Project[] = [];

	constructor() {
		(async () => {
			this.projects = observable((await (await fetch('/project/get', { method: 'post' })).json()).projects);
		})();
	}
}

export default new Store();
