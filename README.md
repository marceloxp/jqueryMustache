# UMS Mustache
> Wrapper jQuery para processar rotinas em Mustache JS.

## Compatível
- Google Chrome
- Firefox
- Safari
- Internet Explorer (9+)

## Demo
<http://umstudiohomolog.com.br/ums/jquery-plugins/jqueryUmsMustache/demo/>

## Estrutura Básica (HTML)
```html
<script type="text/javascript" src="../dist/jqueryUmsMustache.min.js"></script>
```
## Exemplos de uso
```html
<div id="rnd_dom_data"></div>
<script id="tmpl_dom_data" type="x-tmpl-mustache" data-target="rnd_dom_data" data-source="data/ages.json">
	<table class="table table-striped table-bordered table-condensed">
		<tr><th>Nome</th><th>Idade</th></tr>
		{{#data}}
			<tr><td>{{name}}</td><td>{{age}}</td></tr>
		{{/data}}
	</table>
</script>
<script type="text/javascript">
	$(document).ready
	(
		function()
		{
			$('#tmpl_dom_data').mustache();
		}
	);
</script>
```