import { ThemeProvider } from 'styled-components';
import ReactQueryProvider from '../ReactQueryProvider';
import RouterComponent from '../Router';
import theme from '../../styles/theme';
import PopupContainer from '../popups/PopupContainer';
import GlobalStyle from '../../styles/GlobalStyles';

const RootLayoutProvider = () => {
	return (
		<ReactQueryProvider>
			<ThemeProvider theme={theme}>
				<GlobalStyle />
				<RouterComponent />
				<PopupContainer />
			</ThemeProvider>
		</ReactQueryProvider>
	);
};

export default RootLayoutProvider;
