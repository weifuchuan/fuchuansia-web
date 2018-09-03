export interface Project {
	_id: string;
	icon: string;
	name: string;
	profile: string;
	detail: string;
	// order: number;
}

export interface Article {
	_id: string;
	title: string;
	createAt: number;
	content: string;
	articleClass:string; 
}

export interface ArticleClass {
	_id: string;
	name: string;
	profile: string;
	articles: string[];
	order?: number;
}
