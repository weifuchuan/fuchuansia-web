import { Project, ArticleClass, Article } from './model';
import { observable, configure, runInAction } from 'mobx';
import _ from 'lodash';

export * from './model';

export class Store {
	@observable projects: Project[] = [];
	@observable articleClasses: ArticleClass[] = [];
	@observable articles: Article[] = [];

	async fetchProjects() {
		this.projects = observable((await (await fetch('/project/get', { method: 'post' })).json()).projects);
	}

	async fetchArticleClasses() {
		this.articleClasses = observable(
			(await (await fetch('/article-class/get', { method: 'post' })).json()).articleClasses
		);
	}

	async fetchArticleBaseInfo(ids: string[]) {
		this.articles.push(
			...observable(
				((await (await fetch('/article/get/base', {
					method: 'post',
					body: JSON.stringify(ids)
				})).json()) as Article[]).map((a) => ((a.content = ''), a))
			)
		);
	}

	async fetchArticle(ids: string[]) {
		const articles: Article[] = await (await fetch('/article/get', {
			method: 'post',
			body: JSON.stringify(ids)
		})).json();
		runInAction(() => {
			for (let a of articles) {
				const i = this.articles.findIndex((art) => art._id === a._id);
				if (-1 === i) {
					this.articles.push(a);
				} else {
					this.articles[i] = a;
				}
			}
		});
	}

	async getArticleById(id: string): Promise<Article> {
		let a = this.articles.find((art) => art._id === id);
		if (a && a.content) {
			return a;
		} else {
			await this.fetchArticle([ id ]);
			a = this.articles.find((art) => art._id === id);
			if (a) {
				return a;
			} else {
				throw 'article not exists';
			}
		}
	}
}

const store = new Store();
// (window as any).store = store;
export default store;
