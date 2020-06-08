import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

jest.mock('react-chartjs-2', () => ({
    Bar: () => null, // add any additional chart types here
}));
