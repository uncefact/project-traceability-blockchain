import Enzyme, {mount} from "enzyme";
import React from "react";
import Adapter from "enzyme-adapter-react-16";
import {ErrorCard} from "./ErrorCard";
import {mocked} from "ts-jest/utils";
import {Card} from "react-bootstrap";
import {act} from "react-dom/test-utils";

Enzyme.configure({ adapter: new Adapter() });

jest.mock("react-bootstrap", () => {
    let Card = jest.fn().mockImplementation(({children}) => <div className={'Card'}>{children}</div>);

    // @ts-ignore
    Card.Title = jest.fn().mockImplementation(({children}) => <div className={'CardTitle'}>{children}</div>);
    // @ts-ignore
    Card.Text = jest.fn().mockImplementation(({children}) => <div className={'CardText'}>{children}</div>);
    // @ts-ignore
    Card.Body = jest.fn().mockImplementation(({children}) => <div className={'CardBody'}>{children}</div>);

    return {
        Card
    };
});

describe('ErrorCard test', () => {
    const MockedCard = mocked(Card, true);
    const MockedCardTitle = mocked(Card.Title, true);
    const MockedCardText = mocked(Card.Text, true);

    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('Render without crashing', async () => {
        mount(
            <ErrorCard title="test card" />
        );
    });
    it('Content test', () => {
        const childrenComponent = jest.fn().mockImplementation(() => <div className="children">Children</div> );

        mount(
            <ErrorCard title="test card">{childrenComponent}</ErrorCard>
        );

        expect(MockedCard).toHaveBeenCalledTimes(1);
        expect(MockedCardTitle).toHaveBeenCalledTimes(1);
        expect(MockedCardText).toHaveBeenCalledTimes(1);
        expect(MockedCardText.mock.calls[0][0].children).toEqual(childrenComponent);
        expect(MockedCardTitle).toHaveBeenNthCalledWith(1, {children: "test card", className: "Title"}, {});
    });
});
