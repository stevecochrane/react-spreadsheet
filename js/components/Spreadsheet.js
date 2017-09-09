import React from "react";

class Spreadsheet extends React.Component {
	constructor(props) {
		super(props);

		this._toggleSearch = this._toggleSearch.bind(this);
		this._search       = this._search.bind(this);
		this._sort         = this._sort.bind(this);
		this._showEditor   = this._showEditor.bind(this);
		this._save         = this._save.bind(this);

		this.state = {
			data: props.initialData,
			sortby: null,
			descending: false,
			edit: null, // { row: index, cell: index }
			search: false
		};
	}
	render() {
		return (
			<div>
				{this._renderToolbar()}
				{this._renderTable()}
			</div>
		);
	}
	_renderToolbar() {
		return (
			<button onClick={this._toggleSearch} className="toolbar">Search</button>
		);
	}
	_renderSearch() {
		if (!this.state.search) {
			return null;
		}
		return (
			<tr onChange={this._search}>
				{this.props.headers.map(function(_ignore, index) {
					return <td key={index}>
						<input type="text" data-index={index} />
					</td>;
				})}
			</tr>
		);
	}
	_renderTable() {
		return (
			<table>
				<thead onClick={this._sort}>
					<tr>
						{this.props.headers.map(function(title, index) {
							if (this.state.sortby === index) {
								title += this.state.descending ? " \u2191" : " \u2193";
							}
							return <th key={index}>{title}</th>;
						}, this)}
					</tr>
				</thead>
				<tbody onDoubleClick={this._showEditor}>
					{this._renderSearch()}
					{this.state.data.map(function(row, rowIndex) {
						return (
							<tr key={rowIndex}>
								{row.map(function(cell, index) {
									var content = cell;
									var edit = this.state.edit;
									if (edit && edit.row === rowIndex && edit.cell === index) {
										content = <form onSubmit={this._save}>
											<input type="text" defaultValue={content} />
										</form>;
									}
									return <td key={index} data-row={rowIndex}>
										{content}
									</td>;
								}, this)}
							</tr>
						);
					}, this)}
				</tbody>
			</table>
		);
	}
	_sort(ev) {
		var column = ev.target.cellIndex;
		var data = this.state.data.slice();
		var descending = this.state.sortby === column && !this.state.descending;
		data.sort(function(a, b) {
			return descending ? (a[column] < b[column] ? 1 : -1) : (a[column] > b[column] ? 1 : -1);
		});
		this.setState({
			data: data,
			sortby: column,
			descending: descending
		});
	}
	_showEditor(ev) {
		this.setState({
			edit: {
				row: parseInt(ev.target.dataset.row, 10),
				cell: ev.target.cellIndex
			}
		});
	}
	_save(ev) {
		ev.preventDefault();
		var input = ev.target.firstChild;
		var data = this.state.data.slice();
		data[this.state.edit.row][this.state.edit.cell] = input.value;
		this.setState({
			edit: null, // done editing
			data: data
		});
	}
	_toggleSearch() {
		if (this.state.search) {
			this.setState({
				data: this._preSearchData,
				search: false
			});
			this._preSearchData = null;
		} else {
			this._preSearchData = this.state.data;
			this.setState({
				search: true
			});
		}
	}
	_search(ev) {
		var needle = ev.target.value.toLowerCase();
		if (!needle) {
			//  the search string is deleted
			this.setState({
				data: this._preSearchData
			});
			return;
		}
		var index = ev.target.dataset.index; // which column to search
		var searchData = this._preSearchData.filter(function(row) {
			return row[index].toString().toLowerCase().indexOf(needle) > -1;
		});
		this.setState({
			data: searchData
		});
	}
}

export default Spreadsheet;
