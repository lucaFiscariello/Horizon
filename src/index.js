import React from 'react';
import ReactDOM from 'react-dom';
import 'assets/css/App.css';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import AuthLayout from 'layouts/auth';
import AdminLayout from 'layouts/admin';
import RtlLayout from 'layouts/rtl';
import { ChakraProvider } from '@chakra-ui/react';
import theme from 'theme/theme';
import { ThemeEditorProvider } from '@hypertheme-editor/chakra-ui';
import {Provider} from 'react-redux';
import store from 'opensand/redux/index.ts';
import Project from 'views/admin/profile/components/ProjectModification.tsx';


function App() {

   return (
		<ChakraProvider theme={theme}>
			<React.StrictMode>
				<Provider store={store}>
					<ThemeEditorProvider>
							<HashRouter>
								<Switch>
									<Route path={`/auth`} component={AuthLayout} />
									<Route path={`/admin`} component={AdminLayout} />
									<Route path={`/rtl`} component={RtlLayout} />
									<Route path={`/project/:id`} component={Project} />
									<Redirect from='/' to='/admin' />
								</Switch>
							</HashRouter>
					</ThemeEditorProvider>
				</Provider>
			</React.StrictMode>
		</ChakraProvider>
   );
}


ReactDOM.render(<App />, document.getElementById('root'));