var headers = [
    "Book",
    "Author",
    "Language",
    "Published",
    "Sales"
];

var data = [
    [
        "The Lord of the Rings",
        "J. R. R. Tolkien",
        "English",
        "1954-1955",
        "150 million"
    ],
    [
        "Le Petit Prince (The Little Prince)",
        "Antoine de Saint-Exupery",
        "French",
        "1943",
        "140 million"
    ],
    [
        "Harry Potter and the Philosopher's Stone",
        "J. K. Rowling",
        "English",
        "1997",
        "107 million"
    ],
    [
        "And Then There Were None",
        "Agatha Christie",
        "English",
        "1939",
        "100 million"
    ],
    [
        "Dream of the Red Chamber",
        "Cao Xueqin",
        "Chinese",
        "1754-1791",
        "100 million"
    ],
    [
        "The Hobbit",
        "J. R. R. Tolkien",
        "English",
        "1937",
        "100 million"
    ],
    [
        "She: A History of Adventure",
        "H. Rider Haggard",
        "English",
        "1887",
        "100 million"
    ]
];

var logMixin = {
    componentWillUpdate: function() {
        this._log("componentWillUpdate", arguments);
    },
    componentDidUpdate: function() {
        this._log("componentDidUpdate", arguments);
    },
    componentWillMount: function() {
        this._log("componentWillMount", arguments);
    },
    componentDidMount: function() {
        this._log("componentDidMount", arguments);
    },
    componentWillUnmount: function() {
        this._log("componentWillUnmount", arguments);
    },
    _log: function(methodName, args) {
        console.log(this.name + "::" + methodName, args);
    }
};

var Excel = React.createClass({
    displayName: "Excel",
    propTypes: {
        headers: React.PropTypes.arrayOf(
            React.PropTypes.string
        ),
        initialData: React.PropTypes.arrayOf(
            React.PropTypes.arrayOf(
                React.PropTypes.string
            )
        )
    },
    getInitialState: function() {
        return {
            data: this.props.initialData,
            sortby: null,
            descending: false,
            edit: null, // { row: index, cell: index }
            search: false
        };
    },
    render: function() {
        return (
            <div>
                {this._renderToolbar()}
                {this._renderTable()}
            </div>
        );
    },
    _preSearchData: null,
    _renderToolbar: function() {
        return (
            <button onClick={this._toggleSearch} className="toolbar">Search</button>
        );
    },
    _renderSearch: function() {
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
    },
    _renderTable: function() {
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
    },
    _sort: function(ev) {
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
    },
    _showEditor: function(ev) {
        this.setState({
            edit: {
                row: parseInt(ev.target.dataset.row, 10),
                cell: ev.target.cellIndex
            }
        });
    },
    _save: function(ev) {
        ev.preventDefault();
        var input = ev.target.firstChild;
        var data = this.state.data.slice();
        data[this.state.edit.row][this.state.edit.cell] = input.value;
        this.setState({
            edit: null, // done editing
            data: data
        });
    },
    _toggleSearch: function() {
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
    },
    _search: function(ev) {
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
});

ReactDOM.render(
    <Excel headers={headers} initialData={data} />,
    document.getElementById("app")
);
