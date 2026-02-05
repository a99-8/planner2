Planner : Project Overview

An interactive web application (hosted on GitHub Pages) designed for analyzing land data, performing comparative studies, and managing financial adjustments.
1. Data Ingestion (Land Data)

This module handles the initial data entry and preview.

    Interface: A user-friendly upload zone for CSV files.

    Input Data: Files containing land attributes (e.g., Plot Number, Street Width, Number of Streets, etc.).

    Output: An interactive table titled "Uploaded Data Table" that displays the raw content of the file.

2. Comparison Configuration

A dynamic system to manage and define comparison variables.

    Differences Selection Table: Lists all columns from the uploaded CSV. Selecting a column automatically adds it to the Comparison Table.

    Comparison Table: Consists of:

        Static Columns: (Comparison Date, Comparison Type).

        Dynamic Columns: Generated on-the-fly based on selections from the "Differences Selection Table."

3. Adjustments Matrix

This section acts as the bridge between raw data and final evaluation.

    Function: Generates dynamic tables based on the "Differences" selected in the previous step.

    Structure:

        Rows: Unique values extracted from the Land Data Table.

        Columns: Unique values extracted from the Comparison Table.

    Objective: To input adjustment values into the matrix and push them to the final evaluation stage.

4. Evaluation & Analytics (Final Assessment)

The core engine for calculating final results.

    Function: Performs final mathematical operations based on data from all previous sections.

    Calculated Columns:

        Total Adjustments: Summation of all adjustment variables.

        Weighted Average: Calculation of the final weighted score.

        Final Results: Clear visualization of the property's final evaluation.
