import PropTypes from "prop-types";
import styled from "styled-components";

export const TableRowContainer = ({ children, className }) => (
  <div className={className}>{children}</div>
);

export const TableRow = styled(TableRowContainer)`
  display: flex;
  align-items: center;
  border: ${({ border }) => (border ? "1px solid black" : "none")};

  & > div {
    display: flex;
    padding: 0 10px;
    align-items: center;
  }

  & .login-column {
    width: 172px;
  }

  & .registered-at-column {
    width: 213px;
  }

  & .role-column {
    width: auto;
  }
`;
 TableRowContainer.propTypes = {
  children: PropTypes.node.isRequired,
 }