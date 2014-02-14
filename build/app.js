/** @jsx React.DOM */
$(function() {

  window.App = {
    Views: {},
    Router: {}
  };

  App.Views.SidebarItem = React.createClass({
    render: function(){
      var liClass = this.props.isActive ? "active" : "";
      return (
        React.DOM.li( {className:liClass, onClick:this.props.changePill.bind(null,this.props.titleLC)}, 
          React.DOM.a( {href:this.props.href}, this.props.title)
        )
      );
    }
  });

  App.Views.Sidebar = React.createClass({
    isSidebarItemActive: function(name){
      return name && this.props.activePill === name;
    },
    render: function(){
      var items = this.props.titles.map(function(name){
        var nameLC = name.toLowerCase();
        return (
          SidebarItem( {href:"#/"+nameLC,
          key:name,
          title:name,
          titleLC:nameLC,
          isActive:this.isSidebarItemActive(nameLC),
          changePill:this.props.changePill})
          );
      }.bind(this));
      var cx = React.addons.classSet;
      var menuClasses = cx({
          'nav': true,
          'nav-pills': true,
          'nav-stacked': true,
          'animated': true,
          'slideInLeft': this.props.menuVisible,
          'slideOutLeft': !this.props.menuVisible
      });
      return (
        React.DOM.div(null, 
          React.DOM.p(null, 
            React.DOM.button( {type:"button", ref:"menu", onClick:this.props.toggleMenuVisibility, className:"btn btn-info"}, "Menu")
          ),
          React.DOM.ul( {className:menuClasses}, 
            items
          )
        )
        );
    }
  });

  App.Views.Home = React.createClass({
    render: function(){
      return (
        React.DOM.div(null, 
          " This is the home view "
        )
        );
    }
  });

  App.Views.Messages = React.createClass({
    render: function(){
      return (
        React.DOM.div(null, 
          " This is the messages view "
        )
        );
    }
  });

  App.Views.Profile = React.createClass({
    render: function(){
      return (
        React.DOM.div(null, 
          " This is the profile view "
        )
        );
    }
  });

  // revisit this var once Namespacing is supported in react.js
  var SidebarItem = App.Views.SidebarItem;
  var Sidebar = App.Views.Sidebar;

  App.Views.Container = React.createClass({
    getInitialState: function() {
      return {
        menuVisible:true,
        activePill:''
      }
    },
    toggleMenuVisibility: function(){
      this.setState({
        menuVisible: !this.state.menuVisible
      })
    },
    changePill: function(name){
      this.setState({
        activePill:name
      });
    },
    render: function(){
      var cx = React.addons.classSet;
      var sidebarClasses = cx({
          'col-md-3': this.state.menuVisible,
          'col-xs-8': this.state.menuVisible,
          'col-md-1': !this.state.menuVisible,
          'col-xs-3': !this.state.menuVisible
      });
      var menuClasses = cx({
          'col-md-9': this.state.menuVisible,
          'col-md-11': !this.state.menuVisible,
          'col-xs-8': this.state.menuVisible,
          'col-xs-9': !this.state.menuVisible
      });
      return (
        React.DOM.div({className:'row'},
          React.DOM.div({id:'sidebar',className:sidebarClasses},
            App.Views.Sidebar({
              titles:['Home','Profile','Messages'],
              activePill:Backbone.history.fragment,
              menuVisible:this.state.menuVisible,
              toggleMenuVisibility: this.toggleMenuVisibility,
              changePill:this.changePill
            })
          ),
          React.DOM.div({id:'main',className:menuClasses},(App.Views[this.props.mainView])({}))
        )
      )
    }
  });

  App.Router = Backbone.Router.extend({
    routes : {
      '' : 'App404Ctrl',
      'home' : 'AppHomeCtrl',
      'profile' : 'AppProfileCtrl',
      'messages' : 'AppMessagesCtrl',
      '*path' : 'App404Ctrl'
    },
    AppHomeCtrl: function() {
      React.renderComponent(new App.Views.Container({mainView:'Home'}),$('#container')[0]);
    },
    AppProfileCtrl: function() {
      React.renderComponent(new App.Views.Container({mainView:'Profile'}),$('#container')[0]);
    },
    AppMessagesCtrl: function() {
      React.renderComponent(new App.Views.Container({mainView:'Messages'}),$('#container')[0]);
    },
    App404Ctrl: function(){
      this.navigate('home', { trigger: true });
    }
  });

  var AppRouter = new App.Router();
  Backbone.history.start();

});

