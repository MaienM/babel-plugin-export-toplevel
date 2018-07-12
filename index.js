module.exports = ({ types: t }) => ({
	visitor: {
		Program: (path, state) => {
			// Loop over the top level elements only.
			path.get('body').forEach((bodyPath) => {
				if (!bodyPath.isDeclaration()) return;
				if (bodyPath.isImportDeclaration()) return;
				if (bodyPath.isExportNamedDeclaration()) return;

				// Determine the identifiers.
				const identifiers = [];
				// Main identifiers.
				Object.values(t.getBindingIdentifiers(bodyPath.node, false, true)).forEach((identifier) => {
					identifiers.push(identifier);
				});
				// Identifiers that come from the right side of the expression.
				(bodyPath.node.declarations || []).forEach((declaration) => {
					const { init } = declaration;
					if (init && (t.isFunctionExpression(init) || t.isClassExpression(init))) {
						identifiers.push(init.id);
					}
				});

				// Add the export statements.
				if (identifiers.length > 0) {
					const specifiers = identifiers.map((id) => t.exportSpecifier(id, id));
					bodyPath.insertAfter(t.exportNamedDeclaration(null, specifiers));
				}
			});
		}
	}
});
