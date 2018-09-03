export async function uploadMedia(file: File, token: string): Promise<string> {
	let data = new FormData();
	data.append('file', file);
	data.append('token', token);
	const resp = await fetch('/media-upload', { method: 'post', body: data });
	return await resp.text();
}
