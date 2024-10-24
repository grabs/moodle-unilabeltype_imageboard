<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * This file keeps track of upgrades to the mootyper module
 *
 * Sometimes, changes between versions involve alterations to database
 * structures and other major things that may break installations. The upgrade
 * function in this file will attempt to perform all the necessary actions to
 * upgrade your older installation to the current version. If there's something
 * it cannot do itself, it will tell you what you need to do.  The commands in
 * here will all be database-neutral, using the functions defined in DLL libraries.
 *
 * @package
 * @copyright
 * @copyright
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later.
 */

defined('MOODLE_INTERNAL') || die(); // @codingStandardsIgnoreLine

/**
 * Execute unilabelimageboard upgrade from the given old version.
 *
 * @param int $oldversion
 * @return bool
 */
function xmldb_unilabeltype_imageboard_upgrade($oldversion) {
    global $DB;

    $dbman = $DB->get_manager(); // Loads ddl manager and xmldb classes.

    // An upgrade begins here. For each one, you'll need one
    // block of code similar to the next one. Please, delete
    // this comment lines once this file start handling proper
    // upgrade code.

    // First example, some fields were added to install.xml on 2007/04/01.

    if ($oldversion < 2023080100) {
        // Define field continuoustype to be added to mootyper.
        $table = new xmldb_table('unilabeltype_imageboard_tile');
        $field = new xmldb_field('border', XMLDB_TYPE_INTEGER, '3', null, null, null, '0', 'targetheight');

        // Conditionally launch add field continuoustype.
        if (!$dbman->field_exists($table, $field)) {
            $dbman->add_field($table, $field);
        }
        upgrade_plugin_savepoint(true, 2023080100, 'unilabeltype', 'imageboard');
    }
    if ($oldversion < 2023092400) {
        // Define field continuoustype to be added to mootyper.
        $table = new xmldb_table('unilabeltype_imageboard');
        $field = new xmldb_field('fontsize', XMLDB_TYPE_INTEGER, '3', null, null, null, '0', 'canvasheight');

        // Conditionally launch add field continuoustype.
        if (!$dbman->field_exists($table, $field)) {
            $dbman->add_field($table, $field);
        }
        upgrade_plugin_savepoint(true, 2023092400, 'unilabeltype', 'imageboard');
    }
    if ($oldversion < 2023092501) {
        // Define field continuoustype to be added to mootyper.
        $table = new xmldb_table('unilabeltype_imageboard');
        $field = new xmldb_field('titlebackgroundcolor', XMLDB_TYPE_CHAR, '255', null, null, null, '0', 'fontsize');

        // Conditionally launch add field continuoustype.
        if (!$dbman->field_exists($table, $field)) {
            $dbman->add_field($table, $field);
        }
        upgrade_plugin_savepoint(true, 2023092501, 'unilabeltype', 'imageboard');
    }

    return true;
}
