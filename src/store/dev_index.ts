import { Project, ArticleClass, Article } from './model';
import { observable, configure } from 'mobx';
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
		this.articleClasses = observable([
			{
				_id: '1',
				name: '佛学',
				profile: '俺把你来哄',
				articles: [ '1', '3', '4', '7', '8', '9', '10', '11', '12', '13', '14', '15' ]
			},
			{
				_id: '2',
				name: '编程',
				profile: '01010101010101',
				articles: [ '2', '5' ]
			},
			{
				_id: '3',
				name: '社会',
				profile: '去你的吧',
				articles: [ '6' ]
			}
		]);
	}

	async fetchArticleBaseInfo(ids: string[]) {
		this.articles = observable([
			{ _id: '1', title: 'fofofofofofofof', createAt: new Date().getTime(), content: '', articleClass: '1' },
			{
				_id: '2',
				title: 'qqqqqqqqqqqqqqqqqqqqqqqqqqqqqq',
				createAt: new Date().getTime(),
				content: '',
				articleClass: '1'
			},
			{
				_id: '3',
				title: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
				createAt: new Date().getTime(),
				content: '',
				articleClass: '1'
			},
			{
				_id: '4',
				title: 'rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr',
				createAt: new Date().getTime(),
				content: '',
				articleClass: '1'
			},
			{
				_id: '5',
				title: 'yyyyyyyyyyyyyyyyyyyyyyyyyyyy',
				createAt: new Date().getTime(),
				content: '',
				articleClass: '1'
			},
			{
				_id: '6',
				title: 'hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh',
				createAt: new Date().getTime(),
				content: '',
				articleClass: '1'
			},
			{ _id: '7', title: 'fofofofofofofof', createAt: new Date().getTime(), content: '', articleClass: '1' },
			{
				_id: '8',
				title: 'qqqqqqqqqqqqqqqqqqqqqqqqqqqqqq',
				createAt: new Date().getTime(),
				content: '',
				articleClass: '1'
			},
			{
				_id: '9',
				title: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
				createAt: new Date().getTime(),
				content: '',
				articleClass: '1'
			},
			{
				_id: '10',
				title: 'rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr',
				createAt: new Date().getTime(),
				content: '',
				articleClass: '1'
			},
			{
				_id: '11',
				title: 'yyyyyyyyyyyyyyyyyyyyyyyyyyyy',
				createAt: new Date().getTime(),
				content: '',
				articleClass: '1'
			},
			{
				_id: '12',
				title: 'hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh',
				createAt: new Date().getTime(),
				content: '',
				articleClass: '1'
			},
			{ _id: '13', title: 'fofofofofofofof', createAt: new Date().getTime(), content: '', articleClass: '1' },
			{
				_id: '14',
				title: 'qqqqqqqqqqqqqqqqqqqqqqqqqqqqqq',
				createAt: new Date().getTime(),
				content: '',
				articleClass: '1'
			},
			{
				_id: '15',
				title: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
				createAt: new Date().getTime(),
				content: '',
				articleClass: '1'
			},
			{
				_id: '16',
				title: 'rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr',
				createAt: new Date().getTime(),
				content: '',
				articleClass: '1'
			},
			{
				_id: '17',
				title: 'yyyyyyyyyyyyyyyyyyyyyyyyyyyy',
				createAt: new Date().getTime(),
				content: '',
				articleClass: '1'
			},
			{
				_id: '18',
				title: 'hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh',
				createAt: new Date().getTime(),
				content: '',
				articleClass: '1'
			}
		]);
	}

	async fetchArticle(ids: string[]) {
		for (let id of ids) {
			const a = this.articles.find((p) => p._id === id)!;
			a.content = `<p>${a.title +
				a.title +
				a.title +
				a.title +
				a.title +
				a.title +
				a.title +
				a.title +
				a.title +
				a.title +
				a.title +
				a.title +
				a.title +
				a.title +
				a.title +
				a.title +
				a.title +
				a.title +
				a.title +
				a.title +
				a.title +
				a.title +
				a.title +
				a.title +
				a.title}</p>`;
			for (let j = 0; j < 5; j++) {
				a.content = a.content + a.content;
			}
		}
		
	}

	async getArticleById(id: string): Promise<Article> {
		if (this.articleClasses.length === 0) {
			await this.fetchArticleClasses();
			await this.fetchArticleBaseInfo([]); 
		}
		const a = this.articles.find((p) => p._id === id)!;
		await this.fetchArticle([ id ]);
		return a;
	}
}

const store = new Store();
(window as any).store = store;
export default store;
