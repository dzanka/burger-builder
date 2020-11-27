import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import reducer from './auth';
import * as actionTypes from '../actions/actionTypes';

//configure({adapter: new Adapter()});

describe('auth reducer', () => {
    it('should retun the initial state', () => {
        expect(reducer(undefined, {})).toEqual({
                token: null,
                userId: null, 
                error: null,
                loading: false,
                authRedirectPath: '/'
        });
    });

    it('should store the token upon login', () => {
        expect(reducer({
                token: null,
                userId: null, 
                error: null,
                loading: false,
                authRedirectPath: '/'
        }, {
            type: actionTypes.AUTH_SUCCESS,
            userId: 'some-id',
            token: 'some-token' 
        })).toEqual({
            token: 'some-token',
            userId: 'some-id', 
            error: null,
            loading: false,
            authRedirectPath: '/'
        })
    });
});